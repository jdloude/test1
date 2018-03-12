var connection = require("../config/connection.js");

const dao = {
    //get all students
    allStudent: function(cb) {
        const queryString = `SELECT * FROM Students`;
        connection.query(queryString, function(err, result) {
            if (err) {
                throw err;
            } else {
                //console.log("getting all student data");
                cb(result);
            }
        });
    },
    //get current student
    oneStudent: function(user, cb) {
        const queryString = `SELECT * FROM Students WHERE ?`;
        connection.query(queryString, { user }, function(err, result) {
            if (err) {
                throw err;
            } else {
                //console.log("getting data for student: ", user);
                cb(result);
            }
        });
    },
    //get all homework data
    allHW: function(cb) {
        const queryString = `SELECT * FROM Homeworks`;
        connection.query(queryString, function(err, result) {
            if (err) {
                throw err;
            } else {
                //console.log("getting all homework data");
                cb(result);
            }
        });
    },
    //get homework from a specified week
    weekHW: function(week, cb) {
        const queryString = `SELECT * FROM Homeworks WHERE ?`;
        connection.query(queryString, { week }, function(err, result) {
            if (err) {
                throw err;
            } else {
                //console.log("getting homework data for week ", week);
                cb(result);
            }
        });
    },
    //get all lesson data
    allLesson: function(cb) {
        const queryString = `SELECT * FROM Lessons`;
        connection.query(queryString, function(err, result) {
            if (err) {
                throw err;
            } else {
                //console.log("getting all lesson data");
                cb(result);
            }
        });
    },
    //get lesson data from a sepcified week
    weekLesson: function(week, cb) {
        const queryString = `SELECT * FROM Lessons WHERE ?`;
        connection.query(queryString, week, function(err, result) {
            if (err) {
                throw err;
            } else {
                //console.log("getting lesson data for week ", week);
                cb(result);
            }
        });
    },
    // create new student (sign up)
    signUp: function(newStudent, cb) {
        console.log(newStudent);
        const queryString = `INSERT INTO Students (user, password, first_name, last_name, section) VALUES (?,?,?,?,?)`;
        connection.query(
            queryString, [
                newStudent.user,
                newStudent.password,
                newStudent.first_name,
                newStudent.last_name,
                newStudent.section
            ],
            function(err, result) {
                if (err) {
                    throw err;
                } else {
                    console.log("homework turned in");
                    cb(result);
                }
            }
        );
    },
    updatePassword: function(password, student, callback) {
        const queryString = `UPDATE Students SET password = ? WHERE id = ?`;
        connection.query(queryString, [password, student], function(err, result) {
            if (err) {
                throw err;
            } else {
                console.log(`updating password`);
                //callback controls when the request is run
                callback(result);
            }
        });
    },
    //turn in homework to Submits table
    turnIn: function(submit, cb) {
        const queryString = `INSERT INTO Submits (student_id, homework_id, url) VALUES (?,?,?)`;
        connection.query(queryString, [submit.student_id, submit.homework_id, submit.url], function(err, result) {
            if (err) {
                throw err;
            } else {
                console.log("homework turned in");
                cb(result);
            }
        });
    },
    // turnIn: function(submit, cb){
    // 	const queryString = `INSERT INTO Submits (student_id, homework_id, url) VALUES (?,?,?)`;
    // 	connection.query(queryString, [submit.student_id, submit.homework_id, submit.url], function(err, result) {
    //       	if (err) {
    //         	throw err;
    //       	}
    //       	else {
    //       		console.log('homework turned in');
    //       		cb(result);
    //       	}
    //     });
    // },
    //mark at attendence as present
    present: function(student_id, lesson_id, cb) {
        //console.log(student_id, lesson_id);
        const queryString = `INSERT INTO Attends (student_id, lesson_id) VALUES (?,?)`;
        connection.query(queryString, [student_id, lesson_id], function(
            err,
            result
        ) {
            if (err) {
                throw err;
            } else {
                console.log("marked as present");
                cb(result);
            }
        });
    },
    //did a student attend a specified class
    attendance: function(student_id, lesson_id, cb) {
        const queryString = `SELECT * FROM Attends WHERE student_id = ? AND lesson_id = ?`;
        connection.query(queryString, [student_id, lesson_id], function(
            err,
            result
        ) {
            if (err) {
                throw err;
            } else {
                console.log("marked as present");
                cb(result);
            }
        });
    },
    //delete data using id
    delete: function(table, id, cb) {
        const queryString = `DELETE FROM ?? WHERE id = ?`;
        connection.query(queryString, [table, id], function(err, result) {
            if (err) {
                throw err;
            } else {
                console.log(`deleted id: ${id} from table: ${table}`);
                cb(result);
            }
        });
    },
    getWeeks: function(cb) {
        const queryString = `SELECT id, start FROM Weeks`;
        connection.query(queryString, function(err, result) {
            if (err) {
                throw err;
            } else {
                console.log(`get all week info`);
                cb(result);
            }
        });
    }
};

//give access to DAO in other files
module.exports = dao;