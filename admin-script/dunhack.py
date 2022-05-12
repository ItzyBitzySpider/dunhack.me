from hashlib import sha256
import os

import click
import psycopg as db

DATABASE_URL = os.getenv('DATABASE_URL', '')

class Challenge:
    def __init__(self, name:str, category:str, ctf:str, description:str, points:int, hints:list[str], files:list[str]):
        self.name = name
        self.description = description
        self.category = category
        self.ctf = ctf
        self.points = points
        self.hints = hints
        self.files = files
        self.hash = sha256(bytes(name, 'utf-8')).hexdigest()

    def get_categoryId(self):
        with db.connect(DATABASE_URL) as cnx:
            with cnx.cursor() as cursor:
                cursor.execute('SELECT id FROM category WHERE name = %s', (self.category,))
                if (challengeId := cursor.fetchone()) is not None:
                    self.challengeId = challengeId[0]
                    return challengeId
                else:
                    return None

    def get_ctfId(self):
        with db.connect(DATABASE_URL) as cnx:
            with cnx.cursor() as cursor:
                cursor.execute('SELECT id FROM ctfList WHERE name = %s', (self.ctf,))
                if (ctfId := cursor.fetchone()) is not None:
                    self.ctfId = ctfId[0]
                    return ctfId
                else:
                    return None


class Category:
    def __init__(self, name:str, description:str, challenges:list[Challenge]):
        self.name = name
        self.description = description
        self.challenges = challenges

class CTF:
    def __init__(self, name:str, description:str):
        self.name = name
        self.description = description


# --- get ctfs and categories based on directories in cwd ---
def get_ctfs_and_categories():
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
                ctf_categories = get_categories(ctf.name)
                # --- if there are no categories in the ctf, skip it ---
                if ctf_categories != []:
                    ctfs.append(CTF(ctf.name, description))
                    click.secho(f'[*] CTF {ctf.name} has been successfully added', fg='green')
                    # --- if category is a new category ---
                    for ctf_category in ctf_categories:
                        if ctf_category.name not in [category.name for category in categories]:
                            # --- initialize a new category ---
                            categories.append(ctf_category)
                        else:
                            # --- append the category's list of challenges ---
                            for challenge in ctf_category.challenges:
                                categories[ctf_category].challenges.append(challenge)
                else:
                    click.secho(f'[!] CTF {ctf.name} has no categories, skipping it', fg='red')
                    continue
    return ctfs, categories

# --- get categories in a ctf ---
def get_categories(ctf):
    categories = []
    # --- scan ctf directory ---
    with os.scandir(ctf) as scan:
        for category in scan:
            # --- if category is valid dir ---
            if category.is_dir():
                # --- get all challenges in category (and the category's description) ---
                challenges, description = get_challenges(ctf, category.name)
                if challenges != False:
                    categories.append(Category(category.name, description, challenges))
                else:
                    click.secho(f'[!] Category {category.name} in {ctf} has no challenges, skipping it', fg='red')
                    continue
    return categories

# --- get challenges in a category ---
def get_challenges(ctf, category):
    challenges = []
    description = ''
    # --- scan category directory ---
    with os.scandir(path := os.path.join(ctf, category)) as scan:
        for challenge in scan:
            # --- if challenge is valid dir ---
            if challenge.is_dir():
                challenge_details = get_challenge_details(ctf, category, challenge.name, challenge)
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
def get_challenge_details(ctf, category, challenge, path):
    files = []
    points = description = flag = hints = None
    # --- scan challenge for files ---
    with os.scandir(path) as scan:
        for file in scan:
            if file.is_file():
                if file.name == 'POINTS':
                    try:
                        with open(os.path.join(path, 'POINTS')) as f:
                            points = int(f.read().strip())
                    except ValueError:
                        click.secho(f'[!] POINTS for {challenge} ({path}) is not valid, must be an integer, skipping this challenge', fg='red')
                        return False
                elif file.name == 'DESCRIPTION':
                    with open(os.path.join(path, 'DESCRIPTION')) as f:
                        description = f.read()
                elif file.name == 'FLAG':
                    with open(os.path.join(path, 'FLAG')) as f:
                        flag = f.read()
                elif file.name == 'HINTS':
                    with open(os.path.join(path, 'HINTS')) as f:
                        hints = f.readlines()
                else:
                    files.append(file.path)

    # --- check if we're missing anythng ---
    if points is None:
        click.secho(f'[!] POINTS for {challenge} ({path}) does not exist, skipping this challenge', fg='red')
        return False
    elif flag is None:
        click.secho(f'[!] FLAG for {challenge} ({path}) does not exist, skipping this challenge', fg='red')
        return False
    elif description is None:
        click.secho(f'[?] DESCRIPTION for {challenge} ({path}) is empty, initializing to an empty string', fg='blue')
    return Challenge(challenge, category, ctf, points, description, hints, files)



@click.group()
@click.pass_context
def cli(ctx):
    ctx.ensure_object(dict)
    click.echo('CLI for dunhack.me')

@cli.command()
@click.pass_context
def sync(ctx):
    ''' Sync the challenge database with the directory you are in '''
    click.secho('Syncing challenges...', fg='cyan')

    # --- get updated list of ctfs ---
    new_ctfs, new_categories = get_ctfs_and_categories()

    # --- db stuff ---
    with db.connect(DATABASE_URL) as cnx:
        with cnx.cursor() as cursor:
            # --- check ctfs ---
            cursor.execute('SELECT name, description FROM ctfList')
            current_ctfs = cursor.fetchall()
            for ctf in new_ctfs:
                # --- if ctf in directory is not in database ---
                if ctf.name not in [c[0] for c in current_ctfs]:
                    cursor.execute(
                            'INSERT INTO ctfList (name, description) '\
                            'VALUES (%s, %s)',
                            (ctf.name, ctf.description)
                    )
                    click.secho(f'[*] Added new CTF {ctf.name} to database', fg='green')
                # --- if ctf description has been updated ---
                elif ctf.description != [c[1] for c in current_ctfs if c[0] == ctf.name][0]:
                    cursor.execute(
                            'UPDATE ctfList SET description = %s '\
                            'WHERE name = %s',
                            (ctf.description, ctf.name)
                    )
                    click.secho(f'[*] Updated CTF {ctf.name} description', fg='green')
            for ctf in current_ctfs:
                # --- if ctf in database is not in directory ---
                if ctf[0] not in [ctf.name for ctf in new_ctfs]:
                    cursor.execute(
                            'DELETE FROM ctfList WHERE name = %s',
                            (ctf[0],)
                    )
                    click.secho(f'[*] Deleted old CTF {ctf[0]} from database', fg='green')
            cnx.commit()

            # --- check categories ---
            cursor.execute('SELECT name, description FROM category')
            current_categories = cursor.fetchall()
            for category in new_categories:
                # --- if category in directory is not in database ---
                if category.name not in [c[0] for c in current_categories]:
                    cursor.execute(
                            'INSERT INTO category (name, description) '\
                            'VALUES (%s, %s)',
                            (category.name, category.description)
                    )
                    click.secho(f'[*] Added new category {category} to database')
                elif category.description != [c[1] for c in current_categories if c[0] == category.name][0]:
                    cursor.execute(
                            'UPDATE category SET description = %s '\
                            'WHERE name = %s',
                            (category.description, category.name)
                    )
            for category in current_categories:
                # --- if category in database is not in directory ---
                if category[0] not in [category for category in new_categories]:
                    cursor.execute(
                            'DELETE FROM category WHERE name = %s',
                            (category[0],)
                    )
            cnx.commit()

            # --- check challenges ---
            cursor.execute('SELECT id, title, ctfNameId, FROM challenges')
            current_challenges = cursor.fetchall()
            for category in new_categories:
                for challenge in category.challenges:
                    challenge.get_categoryId()
                    challenge.get_ctfId()
                    # --- if challenge doesn't exist in database ---
                    if (challenge.name, challenge.ctfId) not in [(c[1], c[2]) for c in current_challenges]:
                        cursor.execute(
                                'INSERT INTO challenges (title, hash, categoryId, ctfNameId, '\
                                'description, service, flag, initialPoints, minPoints, points, '\
                                'dynamicScoring) '\
                                'VALUES (%s, %s, %s, %s, %s, true, %s, %s, %s, %s, false)',
                                (challenge.name, challenge.hash, challenge.categoryId, challenge.ctfId,
                                challenge.description, challenge.flag, challenge.points, challenge.points, challenge.points)
                        )
                    else:
                        # --- update ctf details just in case ---
                        cursor.execute(
                                'UPDATE challenges SET categoryId = %s, ctfNameId = %s, description = %s, '\
                                'flag = %s, initialPoints = %s, minPoints = %s, points = %s '\
                                'WHERE title = %s AND ctfNameId = %s',
                                (challenge.categoryId, challenge.ctfId, challenge.description, challenge.flag,
                                challenge.points, challenge.points, challenge.points, challenge.name, challenge.ctfId)
                        )
                    # TODO: add hints and files
                for challenge in current_challenges:
                    # --- if challenge doesn't exist in directory ---
                    if (challenge[1], challenge[2]) not in [(c.name, c.ctfId) for c in category.challenges]:
                        cursor.execute(
                                'DELETE FROM challenges WHERE title = %s AND ctfNameId = %s',
                                (challenge[1], challenge[2])
                        )
                click.secho(f'[*] Updated category {category.name} description', fg='green')
            cnx.commit()
