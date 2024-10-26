module.exports = (dotenv, database) => {

    let db = database.createConnection({
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST
    })

    db.connect(err => {
        if (err) throw err;
        console.log('Database is Connected successfully...');
    });

    return db

}