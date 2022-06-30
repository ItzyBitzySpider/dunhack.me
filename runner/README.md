# Runner 
Runner is meant to simplify deployment of isolated challenges during a CTF. Runner utilizes Portainer to deploy challenges and allows the deployment of isolated challenges. Isolated challenges are challenges unique to each user. 

Features:
- Deploy isolated challenges
- Time limit for deployed challenges
- Supports multiple Portainer servers

## Config and Credentials
More details are provided in /config

## Quickstart
1. Configure `/config/config.json` and `/config/credentials.json`
2. Run the binary with `/config` as an argument. I.e `./runner.o /config`

That's it really.

## API Reference

  * `addInstance`
    * Adds an additional Instance for a specific user and challenge.
    * `/addInstance?userid=XXXX&challid=XXXX`
    * `userid` must be a valid userid
    * `challid` is the SHA256 hash of the challenge name, and must be a valid challid within the database (i.e to say, the challengeID has been mapped to an image/stack name)
    * Errors:
      * Missing/Invalid `userID`
      * Missing/Invalid `challID`
      * User has already deployed a challenge (only one challenge per user at any one time)
      * Max number of instances for the platform has already been reached

  * `removeInstance`
    * Removes an Instance for a specific user.
    * `/removeInstance?userid=XXXX`
    * `userid` must be a valid userid
    * Errors:
      * Missing/Invalid `userID`
      * User does not have an instance running
      * User's Instance is still starting

  * `removeInstance/admin`
    * Forcibly removes an Instance for a specific user.
    * `/removeInstance/admin?userid=XXXX`
    * `userid` must be a valid userid
    * Errors:
      * Missing/Invalid `userID`
      * User does not have an instance running

  * `getUserStatus`
    * Gets the time left, challenge info, etc. for a specific user's instance (if available).
    * `/getUserStatus?userid=XXXX`
    * `userid` must be a valid userid
    * Errors:
      * Missing/Invalid `userID`

  * `extendTimeLeft`
    * Extends the time left for a specific user's instance.
    * `extendTimeLeft?userid=XXXX`
    * `userid` must be a valid userid
    * Errors:
      * Missing/Invalid `userID`
      * User does not have an instance running
      * User needs to wait until their instance is closer to the expiry time

  * `addChallenge`
    * Maps a challenge name to its Portainer Image **or** Stack.
    * Requires authorization header!
    * Data is to be sent as a JSON-encoded body. Note that not all fields will be used! See below for more information
      ```
      {
              'challenge_name': , 
              'port_types': ,
              'docker_compose': ,
              'internal_port': ,
              'image_name': ,
              'docker_cmds': ,
              'docker_compose_file': ,
      }
      ```
      * Fields common to both Portainer Image **and** Stack:
        * `challenge_name` (Mandatory): Any valid challenge name in **lowercase**
        * `port_types` (Mandatory): Either `'nc'`, `'ssh'`, or `'http'` per port used that is **comma-separated**, in the same order as provided in `docker_compose_file` (for Portainer Stacks)
        * `docker_compose` (Mandatory): Either `'True'` or `'False'`
      * Fields for Portainer Image **only** (i.e. when `docker_compose` is `'False'`):
        * `internal_port` (Mandatory): Dockerfile exposed port
        * `image_name` (Mandatory): Image name of built Docker image
        * `docker_cmds` (Optional): Commands to be passed to the Docker container on start that is **separated by \n** and **base64-encoded**
      * Fields for Portainer Stack **only** (i.e. when `docker_compose` is `'True'`):
        * `docker_compose_file` (Mandatory): Docker Compose file that is **compatible with Portainer Stacks** and **base64-encoded**
    * Errors:
      * Missing/Invalid Authorization header
      * Invalid JSON
      * Missing/Invalid `challenge_name`
      * Missing/Invalid `docker_compose`
      * For Portainer Image,
        * Missing `internal_port`
        * Missing `image_name`
        * Invalid base64 for `docker_cmds`
      * For Portainer Stack,
        * Missing/Invalid base64 for `docker_compose_file`

  * `removeChallenge`
    * Removes a challenge.
    * `removeChallenge?challId=XXXX`
    * `challId` must be a valid challId
    * Requires authorization header!
    * Errors:
      * Missing/Invalid Authorization header
      * Missing/Invalid `challID`

  * `getStatus`
    * Prints the current status of the runner (number of instances running, details of current instances, etc.)
    * Requires authorization header!
    * Errors:
      * Missing/Invalid Authorization header
