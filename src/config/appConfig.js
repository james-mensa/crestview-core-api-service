require("dotenv").config();

const REMOTE_MONGODB_URL=`mongodb+srv://rixoshotels:${process.env.DB_PASS}@cluster0.re47ble.mongodb.net/?retryWrites=true&w=majority`;
const LOCAL_MONGODB_URL=process.env.LOCAL_MONGODB_URL
const ENV=process.env.NODE_ENV

const configs={
    appEnv:ENV,
    accessToken:process.env.ACCESS_TOKEN_LOCAL,
    refreshToken:process.env.REFRESH_TOKEN_LOCAL,
    environment:process.env.NODE_ENV,
    googleEmail:process.env.GOOGLE_EMAIL_CLIENT,
    googleAppPassword:process.env.GOOGLE_EMAIL_APP_PASSWORD,
    baseMongoDBURL: ENV==='development' ? LOCAL_MONGODB_URL :REMOTE_MONGODB_URL,

    // apiUrl:process.API_URL,
    // clientId:process.CLIENT_ID,
    // clientSecret:process.CLIENT_SECRET,
    // redirectUri:process.REDIRECT_URI,
}



module.exports ={
    appConfig:configs,
}