const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mysql = require('mysql2');
const app = express();

dotenv.config();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended : false }));

const db = require("./app/config/db")(dotenv, mysql);
const middleware = require("./app/middlewares/auth")(jwt);
const controller = require("./app/controllers/index")(db);
require("./routes/routes")(app, controller, middleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
})