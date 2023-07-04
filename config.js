require("dotenv").config()
module.exports = {
    PORT: process.env.PORT,
    DB_URL: process.env.DATABASE_URL,
    DB_NAME: process.env.DATABASE_NAME,
    KEY: process.env.API_KEY,
}