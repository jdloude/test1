//////////////////////need to grab the user data
let userData = {};

function getUserData() {
    $.get("/api/user").then(function(res) {
        userData = res.currentUser;
        console.log("User Data: ", userData);
        // change the name on the page to reflect user's name
        $(".studentName").text(`${userData.name}`);
    });
}
getUserData();

// vars for session and homework containers
let sessionTable = $("#table-session");
getLessons();

// determines the first and last days of the week.
// function currentWeek(length) {
//   curr = new Date(); // get current date
//   first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
//   last = first + length; // last day is the first day + 6
//   firstDay = new Date(curr.setDate(first));
//   lastDay = new Date(curr.setDate(last));
//   console.log(firstDay + " firstday", lastDay + " lastday");
// }

// Function for creating a new list row for lessons
function createLessonRow(lessonData) {
    // format date = can't require moment bc it is a server side package and this is a client side file
    let freshDate = moment(lessonData.date).format("ddd MMMM Do YYYY");

    var newTr = $("<tr>");
    newTr.attr("style", "border-bottom: 1px solid #e0e0e0");
    newTr.append(`<td data-title="${lessonData.title}">${lessonData.title}</td>`);
    newTr.append(
        `<td data-title="${
        lessonData.date
        }"><span style="float:right">${freshDate} ${
        lessonData.time
        } MDT</span></td>`
    );
    newTr.append(`<td><a href="#"><i class="material-icons check-in" id="${
        lessonData.id
        }" style="float:right">playlist_add_check</i></a></td>
  </tr>`);

    return newTr;
}

function getLessons() {
    $.get("/api/lessons").then(function(res) {
        console.log(res);
        // // get the current week
        // let curr;
        // let first;
        // let last;
        // let firstDay;
        // let lastDay;
        // curr = new Date(); // get current date

        // first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        // last = first + 6; // last day is the first day + 6

        // firstDay = new Date(curr.setDate(first));
        // lastDay = new Date(curr.setDate(last));
        // console.log(firstDay + " firstday", lastDay + " lastday");
        // currentWeek(6);

        let lessonsWeekArr = [];

        for (var i = 0; i < res.length; i++) {
            //   let dbFormatDate = new Date(res[i].date);
            //   if (
            //     dbFormatDate.getTime() >= firstDay.getTime() &&
            //     dbFormatDate.getTime() <= lastDay.getTime()

            lessonsWeekArr.push(res[i]);
        }
        console.log(lessonsWeekArr, "here are lessons matching our dates");

        let rowsToAdd = [];
        for (var i = 0; i < lessonsWeekArr.length; i++) {
            rowsToAdd.push(createLessonRow(lessonsWeekArr[i]));
        }
        console.log("Rows to add: ", rowsToAdd);
        sessionTable.append(rowsToAdd);
    });
}

// click events for Attendance
$("body").on("click", ".check-in", regAttend);

//////////////////// function for atendance button visuals and function ????
function attendView() {
    alert(
        "Thanks for being here....now take a required survey. JK - you dont have to."
    );
}

// function to handle click event for class attendance
function regAttend() {
    console.log("click event working");
    // need userID and lessonID to post into attendance table
    let attendData = {
        student_id: userData.id,
        lesson_id: this.id
    };
    console.log("Attend data ", attendData);
    $.post("/api/attend", attendData).then(attendView);

    ///////////////// once attendance is registered, disable the click event
    //   might be able to do this is in the attendView function
}