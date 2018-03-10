var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var session = require('express-session');

var app = express();
app.use(express.static('./public'));
app.use(cors());

var PORT = process.env.PORT || 3000;

app.use(session({
    secret: "Coding is fun",
    resave: false,
    saveUninitialized: true
}));

//middleware for setting up a user object when anyone first come to the appplication
function userSetup(req, res, next) {
    if (!req.session.Student) {
        req.session.Student = {};
        req.session.Student.loggedIn = false;
    }
    next();
}

//using middlewhere acrossed the entire application before any route gets hit.
app.use(userSetup);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

require("./controller/controller.js")(app);

const mediator = require('./mediator');
console.log("starting Server");

mediator.observers.push((emitted) => {
    app.listen(PORT, function() {
        console.log("App listening on PORT " + PORT);
    });
});