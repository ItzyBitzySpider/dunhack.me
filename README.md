# dunhack.me

CTF Platform built with [Next.JS](https://nextjs.org/) React Framework. 

## Installation & Setup

### Installation

Clone with `git clone --recurse-submodules`

The platform is built with the following node.js and npm versions. For how to install node.js and npm, refer to this [guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

```bash
$ node -v
v16.13.0

$ npm -v
8.1.0
```

To get started, simply install dependencies with

```node
$ npm install --legacy-peer-deps
```

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

### Database setup

If you are using the docker-compose file, you may skip this step. The platform uses a MySQL database. Prisma is used to initialize the database schema. After configuring the `DATABASE_URL` in your `.env` file, run

```bash
$ npx prisma generate
$ npx prisma db push
```

## Usage

There are several scripts available for development and deployment. 

## License

It'z Different Platform is [MIT licensed](./LICENSE)
