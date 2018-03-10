// Set up MySQL connection.
var mysql = require("mysql2");

var connection = mysql.createConnection({
    port: 3306,
    host: "bootcampspotv3.coetlkwghhqb.us-west-2.rds.amazonaws.com",
    user: "DUbootcamp",
    password: "bootcamp",
    database: "bootcampspotV3",
    connectTimeout: 300000
});

// Make connection.
connection.connect(function(err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    } else {
        require('../mediator').emit("connected as id" + connection.threadId);
    }
});

// Export connection for our ORM to use.
module.exports = connection;