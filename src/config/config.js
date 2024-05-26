const config = {
    PORT: +process.env.PORT,
    SECRET_KEY: process.env.SECRET_KEY,
    GOOGLE_SIGN_IN_CLIENT_ID: process.env.GOOGLE_SIGN_IN_CLIENT_ID,
    SESSION_EXPIRY_TIME: +process.env.SESSION_EXPIRY_TIME,
    CNX_STRING: process.env.CNX_STRING,
    DB_NAME: process.env.DB_NAME
}
export default config;