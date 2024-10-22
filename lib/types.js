require("dotenv").config();
const configs={
    accessToken:process.env.ACCESS_TOKEN_LOCAL,
    refreshToken:process.env.REFRESH_TOKEN_LOCAL,
    environment:process.env.NODE_ENV,
    googleEmail:process.env.GOOGLE_EMAIL_CLIENT,
    googleAppPassword:process.env.GOOGLE_EMAIL_APP_PASSWORD
    // apiUrl:process.API_URL,
    // clientId:process.CLIENT_ID,
    // clientSecret:process.CLIENT_SECRET,
    // redirectUri:process.REDIRECT_URI,
}



module.exports ={
    configs,
    appConfig:configs,
}