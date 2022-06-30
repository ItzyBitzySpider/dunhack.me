import base64
import logging
import os
import subprocess

import regex
import requests
import yaml



# -----------------------------------------
# --- config vars (change as necessary) ---
# -----------------------------------------
DRYRUN = False
DEBUG = True
runner_endpoint = 'http://localhost:10000'
runner_pw = os.getenv('API_AUTH', 'password')



# --- logging config ---
if DRYRUN or DEBUG:
    logging.basicConfig(level=logging.DEBUG)
else:
    logging.basicConfig(level=logging.INFO)

# --- global vars ---
CTFs = []
challenges = []

# --- build docker-compose.yml and send data to runner endpoint ---
def docker_compose(challenge, chall_data, dir, env):
    # Reject composes with local volumes
    for service in chall_data['services']:
        try:
            defined_volumes = chall_data.get('volumes')
            for volume in chall_data['services'][service]['volumes']:
                if defined_volumes == None or volume not in defined_volumes:
                    logging.warning(f'Service {service} of {challenge} could not be built, volume {volume} is not defined in docker-compose top level. Likely locally mounted (not supported)?')
                    return
        except:
            continue

    # Build docker-compose
    logging.info(f'Building {challenge}...')
    docker = subprocess.run([f'docker-compose', 'build'], cwd=dir, stdout=subprocess.PIPE, env=env)
    try:
        for stdout_line in iter(docker.stdout.readline, ""):
            print('| ' + stdout_line)
    except AttributeError:
        pass
    if docker.returncode != 0:
        logging.warning(f'An error occured while building {challenge}. {bytes.decode(docker.stderr, "utf-8")}')
        return
    else:
        logging.info(f'{challenge} built successfully')

    # Create new docker-compose, count number of ports
    port_count = 0
    new_compose = chall_data
    for service, data in chall_data['services'].items():
        if "ports" in chall_data["services"][service]:
            port_count += len(chall_data["services"][service]["ports"])
        new_compose['services'][service].pop('build', 0)
        new_compose['services'][service]['image'] = f'{challenge.lower()}_{service.lower()}'
    new_compose = bytes(yaml.dump(new_compose), 'utf-8')

    # Send data to runner
    headers = {
            'Authorization': runner_pw
    }
    payload = {
            'challenge_name': challenge.lower(),
            'port_types': ",".join(["nc"] * port_count), #TODO: Handle other permutations
            'docker_compose': 'True',
            'docker_compose_file': bytes.decode(base64.b64encode(new_compose)),
    }
    if not DRYRUN:
        r = requests.post(f'{runner_endpoint}/addChallenge', headers=headers, json=payload)
        if r.status_code != 200:
            logging.warning(f'Runner down? {r.content}')
    if DEBUG:
        logging.debug(f'{headers},{payload}')
    logging.info(f'{challenge} deployed successfully')
    return

# --- build Dockerfile and send data to runner endpoint
def dockerfile(challenge, chall_data, dir, env):
    # Grab port from Dockerfile
    port = regex.search('EXPOSE ([0-9]+)', chall_data)
    if port == None:
        logging.warning(f'{challenge} has no EXPOSE line in Dockerfile, skipping')
        return
    else:
        port = port.group(1)

    # Build image
    logging.info(f'Building {challenge}...')
    docker = subprocess.run([f'docker', 'build', '--tag', f'{challenge}', '.'], cwd=dir, stdout=subprocess.PIPE, env=env)
    try:
        for stdout_line in iter(docker.stdout.readline, ""):
            print('| ' + stdout_line)
    except AttributeError:
        pass
    if docker.returncode != 0:
        logging.warning(f'An error occured while building {challenge}. {bytes.decode(docker.stderr, "utf-8")}')
        return
    else:
        logging.info(f'{challenge} built successfully')

    # Send data to runner
    headers = {
            'Authorization': runner_pw
    }
    payload = {
            'challenge_name': challenge.lower(),
            'port_types': "nc", #TODO: Handle "http"
            'docker_compose': 'False',
            'internal_port': port,
            'image_name': challenge.lower(),
    }
    if not DRYRUN:
        r = requests.post(f'{runner_endpoint}/addChallenge', headers=headers, json=payload)
        if r.status_code != 200:
            logging.warning(f'Runner down? {r.content}')
    if DEBUG:
        logging.debug(f'{headers},{payload}')
    logging.info(f'{challenge} deployed successfully')
    return

# --- main ---
def main():
    env = os.environ.copy()

    # Install haveged to speed up Portainer by increasing system entropy
    haveged = subprocess.run(['apt', 'install', 'haveged'], stdout=subprocess.PIPE, env=env)
    try:
        for stdout_line in iter(haveged.stdout.readline, ""):
            print('| ' + stdout_line)
    except AttributeError:
        pass

    # TODO: 1 thread per challenge to speed up building
    # Scan for challenges
    with os.scandir() as scan:
        for i in scan:
            if i.is_dir():
                challenges.append(i.name)

    # Save challenge data and build image
    for challenge in challenges:
        # Cache challenge directory
        dir = os.path.join('.', challenge)

        # Check for docker-compose.yml
        try:
            with open(os.path.join(dir, 'docker-compose.yml')) as file:
                chall_data = yaml.safe_load(file)
        except FileNotFoundError:
            # logging.warning(f'{challenge} has no docker-compose, skipping')
            # continue
            try:
                with open(os.path.join(dir, 'Dockerfile')) as file:
                    chall_data = file.read()
            except FileNotFoundError:
                logging.warning(f'{challenge} has no docker-compose or Dockerfile, skipping')
            else:
                dockerfile(challenge, chall_data, dir, env)
        else:
            docker_compose(challenge, chall_data, dir, env)

if __name__ == '__main__':
    main()
