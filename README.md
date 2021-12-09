# It'z Different CTF Platform 

CTF Platform built with [Next.js](https://nextjs.org/) React Framework. 

## File Structure

### `/public/`

Contains assets that are publically accessible used throughout the application.

### `/pages/`

Contains typescript files, each file representing a unique web page.

### `/components/`

Contains React Components.

### `/styles/`

Contains Sass stylesheets. 

### `/prisma/`

Contains prisma files used to set up a working database used to login to the platform. 

### `/server/`

Contains database query functions.

### `/types/`

Contains typings for objects used everywhere.

## Setup with [Docker](https://www.docker.com/) 

1) Ensure that you have docker and docker-compose
2) Copy `env.example` to `.env` and enter your configuration

``` 
$ docker-compose up
```

## Setup (Manual)

The platform is built with the following versions

```bash
$ node -v
v16.13.0

$ npm -v
8.1.0
```

#### Configuring authentication

- Github
Go to github, set up OAuth app, add client id and secret to the .env file

- Google
Go to google cloud developer console, set up new OAuth Client ID in Services > Credentials. If you haven't configured OAuth client page, do so. Add clientID, and secret to the .env file. Specify redirect URI as `https://<yourdomain>/api/auth/callback/google`

- Discord
Go to discord developer portal and create a new application. Once created add OAuth and save the required information to your env. Ensure that you add the redirect URI as `https://<yourdomain>/api/auth/callback/discord`

### Install dependencies

``` 
$ npm install
```

### Create `.env` file to store secrets

User Authentication was implemented via the NextAuth library. To configure the platform authentication, please create a `.env` file. Refer to `env.example` file for reference on the information and format required. 