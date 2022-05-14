from hashlib import sha256
import math
import os

import boto3
import click
import psycopg as db



# ------------------
# --- aws config ---
# ------------------
REGION_NAME = 'sgp1'
ENDPOINT_URL = 'https://sgp1.digitaloceanspaces.com'
AWS_ACCESS_KEY_ID = 'KWQ7JQHNQZBIHNVAEDHW'
AWS_SECRET_ACCESS_KEY = 'VmM/QtbJrFnfLWgSlkurHLwu9ZTFD+Grxwk2D3AulJ8'
BUCKET_NAME = 'dunhackorjudgemefiles'

# --- initialize s3 session ---
client = boto3.client(
        's3',
        region_name=REGION_NAME,
        endpoint_url=ENDPOINT_URL,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
)

# -------------------
# --- psql config ---
# -------------------
DATABASE_URL = 'postgresql://root:root@localhost/db'


# -------------------------------
# --- dynamic scoring formula ---
# -------------------------------
def dynamic_formula(initial, min, solves): 
    lb = 0.1;
    ub = 0.75
    with db.connect(DATABASE_URL) as cnx:
        with cnx.cursor() as cursor:
            cursor.execute(
                    'SELECT COUNT(1) FROM "User" '\
                    'WHERE enabled = true',
            )
            total = cursor.fetchone()[0]
    x = solves / total;
    if x <= lb:
        return initial
    elif x >= ub:
        return min
    else:
        return initial - math.ceil((initial - min) / (ub - lb)) * (x - lb);



class Challenge:
    def __init__(self, name, category, ctf, description, points, flag, hints, files):
        self.name = name
        self.description = description
        self.category = category
        self.ctf = ctf
        self.points = points
        self.flag = flag
        self.hints = hints
        self.files = files
        self.hash = sha256(bytes(name, 'utf-8')).hexdigest()

    def get_categoryId(self):
        with db.connect(DATABASE_URL) as cnx:
            with cnx.cursor() as cursor:
                cursor.execute('SELECT id FROM "category" WHERE name = %s', (self.category,))
                if (categoryId := cursor.fetchone()) is not None:
                    self.categoryId = categoryId[0]
                    return categoryId
                else:
                    return None

    def get_ctfId(self):
        with db.connect(DATABASE_URL) as cnx:
            with cnx.cursor() as cursor:
                cursor.execute('SELECT id FROM "ctfList" WHERE name = %s', (self.ctf,))
                if (ctfId := cursor.fetchone()) is not None:
                    self.ctfId = ctfId[0]
                    return ctfId
                else:
                    return None


class Category:
    def __init__(self, name, description, challenges):
        self.name = name
        self.description = description
        self.challenges = challenges

class CTF:
    def __init__(self, name, description):
        self.name = name
        self.description = description


# --- get ctfs and categories based on directories in cwd ---
def get_ctfs_and_categories(dynamic):
    ctfs = []
    categories = []
    # --- scan cwd ---
    with os.scandir() as scan:
        for ctf in scan:
            # --- if ctf is valid dir ---
            if ctf.is_dir():
                # --- if ctf description exists ---
                if os.path.exists(path := os.path.join(ctf.name, 'DESCRIPTION')):
                    with open(path) as f:
                        description = f.read()
                else:
                    click.secho(f'[?] CTF {ctf.name} has no description, initializing it to an empty string', fg='blue')
                    description = ''
                # --- get all categories in ctf (with a list of challenges per category) ---
                ctf_categories = get_categories(ctf.name, dynamic)
                # --- if there are any categories in the ctf ---
                if ctf_categories != []:
                    ctfs.append(CTF(ctf.name, description))
                    click.secho(f'[*] CTF {ctf.name} has been indexed', fg='green')
                    for ctf_category in ctf_categories:
                        # --- if category hasn't been indexed yet ---
                        if (category := next((category for category in categories if category.name == ctf_category.name), False)) is False:
                            # --- initialize a new category ---
                            categories.append(ctf_category)
                        else:
                            # --- append challenges to the indexed category's list of challenges ---
                            for challenge in ctf_category.challenges:
                                category.challenges.append(challenge)
                else:
                    # --- skip this ctf ---
                    click.secho(f'[!] CTF {ctf.name} has no categories, not indexing it', fg='red')
                    continue
    return ctfs, categories

# --- get categories in a ctf ---
def get_categories(ctf, dynamic):
    categories = []
    # --- scan ctf directory ---
    with os.scandir(ctf) as scan:
        for category in scan:
            # --- if category is valid dir ---
            if category.is_dir():
                # --- get all challenges in category (and the category's description) ---
                challenges, description = get_challenges(ctf, category.name, dynamic)
                if challenges != False:
                    categories.append(Category(category.name, description, challenges))
                else:
                    click.secho(f'[!] Category {category.name} in {ctf} has no challenges, not indexing it', fg='red')
                    continue
    return categories

# --- get challenges in a category ---
def get_challenges(ctf, category, dynamic):
    challenges = []
    description = ''
    # --- scan category directory ---
    with os.scandir(path := os.path.join(ctf, category)) as scan:
        for challenge in scan:
            # --- if challenge is valid dir ---
            if challenge.is_dir():
                challenge_details = get_challenge_details(ctf, category, challenge.name, challenge, dynamic)
                if challenge_details != False:
                    challenges.append(challenge_details)
                else:
                    continue
            elif challenge.name == 'DESCRIPTION':
                with open(os.path.join(path, 'DESCRIPTION')) as f:
                    description = f.read()
    if len(challenges) > 0:
        return challenges, description
    else:
        return False, description

# --- get files in challenge ---
def get_challenge_details(ctf, category, challenge, path, dynamic):
    files = []
    points = description = flag = hints = None
    # --- scan challenge for files ---
    with os.scandir(path) as scan:
        for file in scan:
            if file.is_file():
                if file.name == 'POINTS':
                    if dynamic != (0, 0):
                        click.secho(f'[?] Ignoring POINTS for {challenge} ({path.path}) as dynamic scoring is enabled', fg='blue')
                    else:
                        try:
                            with open(os.path.join(path, 'POINTS')) as f:
                                points = int(f.read().strip())
                        except ValueError:
                            click.secho(f'[!] POINTS for {challenge} ({path.path}) is not valid, must be an integer, not indexing this challenge', fg='red')
                            return False
                elif file.name == 'DESCRIPTION':
                    with open(os.path.join(path, 'DESCRIPTION')) as f:
                        description = f.read().strip()
                elif file.name == 'FLAG':
                    with open(os.path.join(path, 'FLAG')) as f:
                        flag = f.read().strip()
                elif file.name == 'HINTS':
                    with open(os.path.join(path, 'HINTS')) as f:
                        hints = [hint.strip() for hint in f.readlines()]
                else:
                    files.append(file.path)

    if dynamic != (0, 0):
        points = dynamic

    # --- check if we're missing anythng ---
    if points is None:
        click.secho(f'[!] POINTS for {challenge} ({path.path}) does not exist, not indexing this challenge', fg='red')
        return False
    elif flag is None:
        click.secho(f'[!] FLAG for {challenge} ({path.path}) does not exist, not indexing this challenge', fg='red')
        return False
    elif description is None:
        click.secho(f'[?] DESCRIPTION for {challenge} ({path.path}) is empty, initializing to an empty string', fg='blue')
    return Challenge(challenge, category, ctf, description, points, flag, hints, files)


# --- sync ctfs ---
def sync_ctfs(new_ctfs):
    with db.connect(DATABASE_URL) as cnx:
        with cnx.cursor() as cursor:
            cursor.execute('SELECT id, name, description FROM "ctfList"')
            current_ctfs = cursor.fetchall()
            for ctf in new_ctfs:
                # --- if ctf in directory is not in database ---
                if (c := next((c for c in current_ctfs if c[1] == ctf.name), False)) is False:
                    cursor.execute(
                            'INSERT INTO "ctfList" (name, description) '\
                            'VALUES (%s, %s)',
                            (ctf.name, ctf.description)
                    )
                    click.secho(f'[*] Added new CTF {ctf.name} to database', fg='green')
                # --- if ctf description has been updated ---
                elif ctf.description != c[2]:
                    cursor.execute(
                            'UPDATE "ctfList" SET description = %s '\
                            'WHERE name = %s',
                            (ctf.description, ctf.name)
                    )
                    click.secho(f'[*] Updated CTF {ctf.name} description in database', fg='green')
            for ctf in current_ctfs:
                # --- if ctf in database is not in directory ---
                if ctf[1] not in [ctf.name for ctf in new_ctfs]:
                    # --- delete all challs from this ctf ---
                    cursor.execute(
                            'SELECT id, title FROM challenges WHERE "ctfNameId" = %s',
                            (ctf[0],)
                    )
                    challenges = cursor.fetchall()
                    for challenge in challenges:
                        cursor.execute(
                                'DELETE FROM "hints" WHERE "challengeId" = %s',
                                (challenge[0],)
                        )
                        cursor.execute(
                                'DELETE FROM "files" WHERE "challengeId" = %s',
                                (challenge[0],)
                        )
                        cursor.execute(
                                'DELETE FROM "challenges" WHERE id = %s',
                                (challenge[0],)
                        )
                        click.secho(f'[*] Deleted challenge {challenge[1]}', fg='green')
                    cursor.execute(
                            'DELETE FROM "ctfList" WHERE id = %s',
                            (ctf[0],)
                    )
                    click.secho(f'[*] Deleted old CTF {ctf[0]} from database', fg='green')
            cnx.commit()

# --- sync categories ---
def sync_categories(new_categories):
    with db.connect(DATABASE_URL) as cnx:
        with cnx.cursor() as cursor:
            cursor.execute('SELECT id, name, description FROM "category"')
            current_categories = cursor.fetchall()
            for category in new_categories:
                # --- if category in directory is not in database ---
                if (c := next((c for c in current_categories if c[1] == category.name), False)) is False:
                    cursor.execute(
                            'INSERT INTO "category" (name, description) '\
                            'VALUES (%s, %s)',
                            (category.name, category.description)
                    )
                    click.secho(f'[*] Added new category {category.name} to database', fg='blue')
                elif category.description != c[2]:
                    cursor.execute(
                            'UPDATE "category" SET description = %s '\
                            'WHERE name = %s',
                            (category.description, category.name)
                    )
                    click.secho(f'[*] Updated category {category.name} description in database', fg='green')
            for category in current_categories:
                # --- if category in database is not in directory ---
                if category[1] not in [category.name for category in new_categories]:
                    # --- delete all challs from this category ---
                    cursor.execute(
                            'SELECT id, title FROM challenges WHERE "categoryId" = %s',
                            (category[0],)
                    )
                    challenges = cursor.fetchall()
                    for challenge in challenges:
                        cursor.execute(
                                'DELETE FROM "hints" WHERE "challengeId" = %s',
                                (challenge[0],)
                        )
                        cursor.execute(
                                'DELETE FROM "files" WHERE "challengeId" = %s',
                                (challenge[0],)
                        )
                        cursor.execute(
                                'DELETE FROM "challenges" WHERE id = %s',
                                (challenge[0],)
                        )
                        click.secho(f'[*] Deleted challenge {challenge[1]}', fg='green')
                    cursor.execute(
                            'DELETE FROM "category" WHERE id = %s',
                            (category[0],)
                    )
                    click.secho(f'[*] Deleted old category {category[1]} from database', fg='green')
            cnx.commit()

# --- sync challenges ---
def sync_challenges(new_challenges):
    with db.connect(DATABASE_URL) as cnx:
        with cnx.cursor() as cursor:
            cursor.execute('SELECT id, title, "ctfNameId", solves FROM "challenges"')
            current_challenges = cursor.fetchall()

            # --- check if bucket exists ---
            response = client.list_buckets()
            spaces = [space['Name'] for space in response['Buckets']]
            if BUCKET_NAME not in spaces:
                # --- create bucket ---
                client.create_bucket(Bucket=BUCKET_NAME)

            for challenge in new_challenges:
                challenge.get_ctfId()
                challenge.get_categoryId()
                # --- if challenge doesn't exist in database ---
                if (c := next((c for c in current_challenges if c[1] == challenge.name and c[2] == challenge.ctfId), False)) is False:
                    if type(challenge.points) == int:
                        # --- static scoring ---
                        data = {
                                "title": challenge.name,
                                "description": challenge.description,
                                "flag": challenge.flag,
                                "hash": challenge.hash,
                                "categoryId": challenge.categoryId,
                                "ctfNameId": challenge.ctfId,
                                "points": challenge.points,
                                "minPoints": challenge.points,
                                "initialPoints": challenge.points,
                                "dynamicScoring": False,
                        }
                    else:
                        # --- dynamic scoring ---
                        data = {
                                "title": challenge.name,
                                "description": challenge.description,
                                "flag": challenge.flag,
                                "hash": challenge.hash,
                                "categoryId": challenge.categoryId,
                                "ctfNameId": challenge.ctfId,
                                "points": challenge.points[0],
                                "minPoints": challenge.points[1],
                                "initialPoints": challenge.points[0],
                                "dynamicScoring": True,
                        }
                    # --- insert challenge ---
                    cursor.execute(
                            'INSERT INTO "challenges" (title, hash, "categoryId", "ctfNameId", '\
                            'description, service, flag, "initialPoints", "minPoints", points, '\
                            '"dynamicScoring") '\
                            'VALUES (%(title)s, %(hash)s, %(categoryId)s, %(ctfNameId)s, '\
                            '%(description)s, false, %(flag)s, %(initialPoints)s, %(minPoints)s, '\
                            '%(points)s, %(dynamicScoring)s)',
                            data,
                    )
                else:
                    # --- update challenge details ---
                    if type(challenge.points) == int:
                        # --- static scoring ---
                        data = {
                                "id": c[0],
                                "description": challenge.description,
                                "flag": challenge.flag,
                                "categoryId": challenge.categoryId,
                                "points": challenge.points,
                                "minPoints": challenge.points,
                                "initialPoints": challenge.points,
                                "dynamicScoring": False,
                        }
                    else:
                        # --- dynamic scoring ---
                        data = {
                                "id": c[0],
                                "description": challenge.description,
                                "flag": challenge.flag,
                                "categoryId": challenge.categoryId,
                                "points": dynamic_formula(challenge.points[0], challenge.points[1], c[3]),
                                "minPoints": challenge.points[1],
                                "initialPoints": challenge.points[0],
                                "dynamicScoring": True,
                        }

                    cursor.execute(
                            'UPDATE "challenges" SET "categoryId" = %(categoryId)s, '\
                            'description = %(description)s, flag = %(flag)s, '\
                            '"initialPoints" = %(initialPoints)s, "minPoints" = %(minPoints)s, '\
                            'points = %(points)s, "dynamicScoring" = %(dynamicScoring)s'\
                            'WHERE id = %(id)s',
                            data,
                    )

                # --- get challenge id ---
                cursor.execute(
                        'SELECT id FROM challenges '\
                        'WHERE title = %s AND "ctfNameId" = %s',
                        (challenge.name, challenge.ctfId)
                )
                if (challengeId := cursor.fetchone()) is not None:
                    challenge.challengeId = challengeId[0]
                else:
                    print(f"ChallengeID for {challenge.name} not found!")

                # --- clear hints and files in database for this challenge, if any ---
                cursor.execute(
                        'DELETE FROM "files" WHERE "challengeId" = %s',
                        (challenge.challengeId,)
                )
                cursor.execute(
                        'DELETE FROM "hints" WHERE "challengeId" = %s',
                        (challenge.challengeId,)
                )

                # --- insert files ---
                if challenge.files:
                    for file in challenge.files:
                        with open(file, "rb") as f:
                            file_name = os.path.basename(file)
                            # --- file identifer: sha256(challengeName_fileName) ---
                            file_hash = sha256(bytes(f'{challenge.challengeId}_{file_name}', 'utf-8')).hexdigest()

                            # --- upload file to bucket ---
                            client.put_object(Bucket=BUCKET_NAME, Key=file_hash, Body=f, ACL="public-read", ContentDisposition=f'attachment; filename="{file_name}"')

                            # --- insert file info into db ---
                            cursor.execute(
                                    'INSERT INTO "files" ("challengeId", title, url) '\
                                    'VALUES (%s, %s, %s)',
                                    (challenge.challengeId, file_name, f'https://files.dunhack.me/{file_hash}')
                            )

                # --- insert hints ---
                if challenge.hints:
                    # --- insert hints ---
                    for hint in challenge.hints:
                        cursor.execute(
                                'INSERT INTO "hints" ("challengeId", body) '\
                                'VALUES (%s, %s)',
                                (challenge.challengeId, hint)
                        )

            for challenge in current_challenges:
                # --- if challenge doesn't exist in directory ---
                if (challenge[1], challenge[2]) not in [(c.name, c.ctfId) for c in new_challenges]:
                    cursor.execute(
                            'DELETE FROM "hints" WHERE "challengeId" = %s',
                            (challenge[0],)
                    )
                    cursor.execute(
                            'DELETE FROM "files" WHERE "challengeId" = %s',
                            (challenge[0],)
                    )
                    cursor.execute(
                            'DELETE FROM "challenges" WHERE id = %s',
                            (challenge[0],)
                    )
                    click.secho(f'[*] Deleted challenge {challenge[1]}', fg='green')
            click.secho(f'[*] Updated challenges in database', fg='green')
            cnx.commit()


# --- cli ---
@click.group()
@click.pass_context
def cli(ctx):
    ctx.ensure_object(dict)
    click.echo('CLI for dunhack.me')

@cli.command()
@click.option('-d', '--dynamic', type=(int, int), default=(0, 0), help='The initial and minimum points for dynamic scoring respectively. This will enable dynamic scoring.')
@click.pass_context
def sync(ctx, dynamic):
    ''' Sync the challenge database with the directory you are in '''
    if dynamic[1] > dynamic[0]:
        raise click.BadOptionUsage('--dynamic', 'Minimum points is greater than initial points')
    click.secho('Syncing challenges...', fg='cyan')

    # --- get updated list of ctfs ---
    new_ctfs, new_categories = get_ctfs_and_categories(dynamic)
    new_challenges = []
    for category in new_categories:
        for challenge in category.challenges:
            new_challenges.append(challenge)
    sync_ctfs(new_ctfs)
    sync_categories(new_categories)
    sync_challenges(new_challenges)
    click.secho('Done!', fg='cyan')
