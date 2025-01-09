require("dotenv").config();
const REMOTE_MONGODB_URL=`mongodb+srv://rixoshotels:${process.env.DB_PASS}@cluster0.re47ble.mongodb.net/?retryWrites=true&w=majority`;
const LOCAL_MONGODB_URL=process.env.LOCAL_MONGODB_URL
const ENV=process.env.NODE_ENV

const settings={
    appEnv:ENV,
    accessToken:process.env.ACCESS_TOKEN_LOCAL,
    refreshToken:process.env.REFRESH_TOKEN_LOCAL,
    environment:process.env.NODE_ENV,
    googleEmail:process.env.GOOGLE_EMAIL_CLIENT,
    googleAppPassword:process.env.GOOGLE_EMAIL_APP_PASSWORD,
    baseMongoDBURL: ENV==='development' ? LOCAL_MONGODB_URL :REMOTE_MONGODB_URL,
    db_scret:process.env.DB_SECRET,
    appSecret:process.env.APP_SECRET,
    googAuthLink:process.env.GOOGLE_AUTH_LINK,
    api_version: process.env.API_VERSION,
    host_port:process.env.HOST_PORT ?? 5000,
    domain:ENV==='development' ? `http://localhost:${process.env.HOST_PORT ?? 5000}/api/${process.env.API_VERSION}` :process.env.SITE_DOMAIN,
    cloudinaryForStorageEnabled: process.env.USE_CLOUDINARY_FOR_PRIMARY_ARTIFACT_STORAGE === 'true',
    cloudinaryName: process.env.CLOUDINARY_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET

}



export  {
    settings as appConfig,
}