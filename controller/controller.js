//bringing in the bcrypt npm module
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt');
var dao = require("../config/dao.js");
var app = require('express');
// var app = express.app();
module.exports = function(app) {
    //=================================HTML Routes========================================

    // Create all our routes and set up logic within those routes where required.
    app.get("/", function(req, res) {
        if (req.session.Student.loggedIn === true) {
            res.sendFile(path.join(__dirname, "../public/landing.html"));
            //console.log(req.session.Student);
        } else {
            res.sendFile(path.join(__dirname, "../public/index.html"));
            dao.allStudent(function(data) {
                //console.log(data);
            });
        }
    });

    app.get("/attendance", function(req, res) {
        if (req.session.Student.loggedIn === true) {
            res.sendFile(path.join(__dirname, "../public/attendance.html"));
        } else {
            res.sendFile(path.join(__dirname, "../public/index.html"));
            dao.allStudent(function(data) {
                //console.log(data);
            });
        }
    });

    app.get("/calendar", function(req, res) {
        if (req.session.Student.loggedIn === true) {
            res.sendFile(path.join(__dirname, "../public/calendar.html"));
        } else {
            res.sendFile(path.join(__dirname, "../public/index.html"));
            dao.allStudent(function(data) {
                //console.log(data);
            });
        }
    });

    app.get("/class", function(req, res) {
        if (req.session.Student.loggedIn === true) {
            res.sendFile(path.join(__dirname, "../public/class.html"));
        } else {
            res.sendFile(path.join(__dirname, "../public/index.html"));
            dao.allStudent(function(data) {
                //console.log(data);
            });
        }
    });

    app.get("/contact", function(req, res) {
        if (req.session.Student.loggedIn === true) {
            res.sendFile(path.join(__dirname, "../public/contact.html"));
        } else {
            res.sendFile(path.join(__dirname, "../public/index.html"));
            dao.allStudent(function(data) {
                //console.log(data);
            });
        }
    });

    app.get("/landing", function(req, res) {
        if (req.session.Student.loggedIn === true) {
            res.sendFile(path.join(__dirname, "../public/landing.html"));
            //console.log(req.session.Student);
        } else {
            res.sendFile(path.join(__dirname, "../public/index.html"));
            dao.allStudent(function(data) {
                //console.log(data);
            });
        }
    });

    app.get("/homework", function(req, res) {
        if (req.session.Student.loggedIn === true) {
            res.sendFile(path.join(__dirname, "../public/homework.html"));
        } else {
            res.sendFile(path.join(__dirname, "../public/index.html"));
            dao.allStudent(function(data) {
                // console.log(data);
            });
        }
    });

    //==================================API Routes===============================================

    //login endpoint
    app.post("/api/login", function(req, res) {
        //will show our user data from front end
        //console.log("this is the response", req.body);
        //will see the currently formatted session object with user data
        //console.log(req.session);
        //initalizing user data variable to an empty object. this will hold our user data on this endpoint
        var student = {};

        //using our Student model to query our MySQL database for user info where ther user equals the user we passed in from the front end
        dao.oneStudent(req.body.user, function(data) {
            //         //if the database does not find a user with that user we will revice a null value from our database. null values are a little "special" in relation to JS.
            //         //this is how we would correctly do a check for a null value if recieved
            if (!data && typeof data === "object") {
                //             //this will send an error code to our front end for the user not existing
                res.status(404).send('ohhh no, there is a problem with the user or password!');
            } else {
                //here we bring in bcrypt. bcrypt's compair method asks for a few things. it asks for the first parameter you send in a plain text password. 
                //AKA: our users password coming in from the front end. the second parameter bcrypt wants us to pass in the hashed password that we stored in the db. lastly it wants a callback funtion
                //bcrypt will hash the pasword coming in from the front end and compaire it to the users hashed password from our database it will give us a boolean value to let us know if the passwords were the same
                bcrypt.compare(req.body.password, data[0].password, function(err, bcryptRes) {
                    //console.log("user defined password:", req.body.password);
                    //console.log("database Password:", data[0].password);
                    //console.log(bcryptRes);

                    //     //if the response is false send an error to the front end letting the user know that the passwords did not match.
                    if (bcryptRes !== true) {
                        res.status(404).send("ohhh no, there is a problem with the user or password but its real!");
                    } else {
                        //if the response from bcrypt was true we know our users password matched and we can now format the user data coming from the database to be sent to the font end
                        var studentObj = { id: data[0].id, name: data[0].first_name + " " + data[0].last_name, user: data[0].user };

                        //we update the loggedIn key to have a true value. we can use this value on the fron end to see if the user is logged in or not.
                        req.session.Student.loggedIn = true;

                        //here the session's user object is updated with the users data. we can hit our /session endpoing witha  get request from the front end and get our user object.
                        req.session.Student.currentUser = studentObj;
                        res.json({ status: 200 });
                    }
                });
            }
        });
    });

    app.post("/api/signUp", function(req, res, next) {
        //to store a hased password into the database we need to first salt our password. this will tell bcrypt how many time to pass through the users password to generate the hash
        bcrypt.genSalt(10, function(err, salt) {
            //the bcrypt hash method will then 
            bcrypt.hash(req.body.password, salt, function(err, hash) {
                // Store hash in your password DB.
                req.body.password = hash;
                var newStudent = {
                    user: req.body.user,
                    password: req.body.password,
                    first_name: req.body.first_name,
                    last_name: req.body.last_name,
                    section: req.body.section
                };

                dao.signUp(newStudent, function(data) {
                    var studentObj = { id: data.insertId, name: newStudent.first_name + " " + newStudent.last_name, user: newStudent.user };
                    req.session.Student.loggedIn = true;
                    req.session.Student.currentUser = studentObj;
                    res.json(data);
                });


            });
        });
    });

    app.get("/api/user", function(req, res) {
        res.json(req.session.Student);
    });

    app.get("/api/lessons", function(req, res) {
        dao.allLesson(function(data) {
            //console.log(data);
            res.json(data);
        });
    });

    app.get("/api/homeworks", function(req, res) {
        dao.allHW(function(data) {
            //console.log(data);
            res.json(data);
        });
    });
    app.post("/api/attend", function(req, res) {
        dao.present(req.body.student_id, req.body.lesson_id,
            function(result) {
                // Send back the ID of the new quote
                res.json({ id: result.insertId });
            }
        );
    });
    app.post("/api/submitHMWK", function(req, res) {
        let submit = req.body
            //console.log(req.body.student_id);
        dao.turnIn(submit, function(result) {
            // Send back the ID of the new quote
            res.json({ id: result.insertId });
        });
    });
    //=============================Last HTML Route========================================
    // If no matching route is found default to home
    app.get("*", function(req, res) {
        if (req.session.Student.loggedIn === true) {
            res.sendFile(path.join(__dirname, "../public/landing.html"));
        } else {
            res.sendFile(path.join(__dirname, "../public/index.html"));
            dao.allStudent(function(data) {
                //console.log(data);
            });
        }
    });
};