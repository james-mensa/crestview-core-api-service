# Crestview Core API Service

This project is the backend service for the Crestview web app.

## Available Scripts

In the project directory, you can run:

### `npm dev`

Open [http://localhost:[port]/api/v1/docs](http://localhost:[port]/api/v1/docs) to view it in your browser.

### `npm run build`

Builds the app for production to the `dist` folder.

## Configuration

| **Configuration Name**                                 | **Description**                                                    | **Example/Notes**                           |
|--------------------------------------------------------|--------------------------------------------------------------------|---------------------------------------------|
| **Authentication Tokens**                              |                                                                    |                                             |
| `ACCESS_TOKEN_LOCAL`                                   | Local access token key for sessions                                |                                             |
| `REFRESH_TOKEN_LOCAL`                                  | Local refresh token key for sessions                               |                                             |
| `REFRESH_TOKEN_SECRET`                                 | Secret key for generating refresh tokens                           |                                             |
| **Account and Activation**                             |                                                                    |                                             |
| `ACCOUNT_ACTIVATION`                                   | Secret or token for account activation                             |                                             |
| **Database Configuration**                              |                                                                    |                                             |
| `LOCAL_MONGODB_URL`                                    | MongoDB connection URL                                             | e.g., `mongodb://localhost:27017`            |
| **Database Configuration (Remote)**                    |                                                                    |                                             |
| `DB_PASS`                                              | Database password                                                  |                                             |
| `DB_SECRET`                                            | Database secret key for additional security                        |                                             |
| **Email Configuration**                                |                                                                    |                                             |
| `EMAIL`                                                | Default email address for outgoing emails                          |                                             |
| `EMAIL_PASS`                                           | Password or app password for the email account                     |                                             |
| `EMAIL_MAIN_URL`                                       | URL of the main site used in email templates (e.g., activation links)|                                             |
| `GOOGLE_EMAIL_APP_PASSWORD`                            | Google app password for email                                      |                                             |
| `GOOGLE_EMAIL_CLIENT`                                  | Email address used for sending through Google services             |                                             |
| **Google Authentication**                              |                                                                    |                                             |
| `GOOGLE_AUTH_CLIENT_ID`                                | Google OAuth client ID                                             |                                             |
| `GOOGLE_AUTH_SECRET`                                   | Google OAuth client secret                                         |                                             |
| **Artifact Storage**                                   |                                                                    |                                             |
| `USE_CLOUDINARY_FOR_PRIMARY_ARTIFACT_STORAGE`          | Set to 'true' to use Cloudinary for primary artifact storage; 'false' for base64 db storage |                                             |
| **Cloudinary Configuration**                           | Required if `USE_CLOUDINARY_FOR_PRIMARY_ARTIFACT_STORAGE` is set to 'true' |                                             |
| `CLOUDINARY_NAME`                                      | Cloudinary account name                                            |                                             |
| `CLOUDINARY_API_KEY`                                   | Cloudinary API key                                                 |                                             |
| `CLOUDINARY_API_SECRET`                                | Cloudinary API secret                                              |                                             |
| **Application Configuration**                          |                                                                    |                                             |
| `NODE_ENV`                                             | Node environment (e.g., development, production)                    |                                             |
| `NODE_VERSION`                                         | Node.js version                                                    |                                             |
| `SITE_DOMAIN`                                          | The main domain or URL of the site                                 |                                             |
| `API_VERSION`                                          | API version (e.g., v1)                                             | `v1.1`                                      |
| `HOST_PORT`                                            | Port the application will run on                                   |                                             |
