# It'z Different CTF Platform 

CTF Platform built with [Next.JS](https://nextjs.org/) React Framework. 

## Installation & Setup

### Installation

The platform is built with the following node.js and npm versions. For how to install node.js and npm, refer to this [guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

```bash
$ node -v
v16.13.0

$ npm -v
8.1.0
```

To get started, simply install dependencies with

```node
$ npm i
```

### Database setup

The platform uses a MySQL database. 

### Configuring environment variables

You will need to create a `.env` file in the project root. Refer to the [`env.example`](./env.example) file for the environment variables required. The following is how you may obtain some of their values.

1. **Database URL**    
   If you are using planning to use the docker-compose provided, you may leave the value as is. However, if you plan on hosting the database instance separately, please modify the value as follows:  
   ```mysql://<USERNAME>:<PASSWORD>@<HOST>:<PORT>/<DATABASE_NAME>```

2. **Email Server**  
   This field would contain the details required to send emails for user logins. The `EMAIL_SERVER` field uses the following format:  
   `smtp://<USERNAME>:<PASSWORD>@<SERVER NAME>:<PORT>`  
   Below are some guides on how to set up SMTP server for different email providers. 
   1. [Gmail](https://kb.synology.com/en-global/SRM/tutorial/How_to_use_Gmail_SMTP_server_to_send_emails_for_SRM)
   2. [Yahoo](https://serversmtp.com/smtp-yahoo/#:~:text=SMTP%20server%20address%3A%20smtp.mail,name%3A%20your%20Yahoo!%20Mail%20account)
   3. [TurboSMTP](https://serversmtp.com/step-by-step-tutorials/)

3. **OAuth Client ID and Secrets**  
   These fields contain the necessary details for the OAuth providers to authenticate users. See below on how to set up an OAuth application with the respective providers.  
   1. [GitHub](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
   2. [Google](https://support.google.com/cloud/answer/6158849?hl=en)
   3. [Discord](https://discord.com/developers/docs/topics/oauth2)  
   
   When setting up the OAuth applications, ensure to change the Callback URL for each provider. E.g. Discord Callback URL should be: `https://<yourdomain>/api/auth/callback/discord`

4. **Next Auth URL**  
   When deploying to production, set the `NEXTAUTH_URL` environment variable to the canonical URL of your site.

## Usage

There are several scripts available for development and deployment. 

## License

It'z Different Platform is [MIT licensed](./LICENSE)

















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