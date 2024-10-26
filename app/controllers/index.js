module.exports = (db) => {

    let module = {}

    module.user = require("./user")(db)

    return module

}