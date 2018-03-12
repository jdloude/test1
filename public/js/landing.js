//////////////////////need to grab the user data

let userData = {};

function getUserData() {
    $.get("/api/user").then(function(res) {
        userData = res.currentUser;
        // change the name on the page to reflect user's name
        $(".studentName").text(`${userData.name}`);
    });
}
getUserData();

// vars for session and homework containers
let sessionTable = $("#table-session");
let hmwkTable = $("#table-homework");
getLessons();
getHomework();

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
        // get the current week
        let curr;
        let first;
        let last;
        let firstDay;
        let lastDay;
        curr = new Date(); // get current date

        first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        last = first + 6; // last day is the first day + 6

        firstDay = new Date(curr.setDate(first));
        lastDay = new Date(curr.setDate(last));
        //console.log(firstDay + " firstday", lastDay + " lastday");
        // currentWeek(6);

        let lessonsWeekArr = [];

        for (var i = 0; i < res.length; i++) {
            let dbFormatDate = new Date(res[i].date);
            if (
                dbFormatDate.getTime() >= firstDay.getTime() &&
                dbFormatDate.getTime() <= lastDay.getTime()
            ) {
                lessonsWeekArr.push(res[i]);
            }
        }
        //console.log(lessonsWeekArr, "here are lessons matching our dates");

        let rowsToAdd = [];
        for (var i = 0; i < lessonsWeekArr.length; i++) {
            rowsToAdd.push(createLessonRow(lessonsWeekArr[i]));
        }
        //console.log("Rows to add: ", rowsToAdd);
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
    //console.log("click event working");
    // need userID and lessonID to post into attendance table
    let attendData = {
        student_id: userData.id,
        lesson_id: this.id
    };
    //console.log("Attend data ", attendData);
    $.post("/api/attend", attendData).then(attendView);

    ///////////////// once attendance is registered, disable the click event
    //   might be able to do this is in the attendView function
}
//////////////// HOMEWORK
function createHomeworkRow(homeworkData) {
    // format date
    let freshDue = moment(homeworkData.due).format("ddd MMMM Do YYYY");
    var newTr = `<tr style", "border-bottom: 1px solid #e0e0e0"> <td data-title="${
        homeworkData.title
        }">${homeworkData.title}</td> 
  <td data-title="${
        homeworkData.due
        }"><span style="float:right">${freshDue}</span></td><td><a href="#"><i class="material-icons md-36 hmwkFormToggle" id="icon${
        homeworkData.id
        }" style="float:right">description</i></a></td>
    </tr><tr>
    <td id="hmwkForm${homeworkData.id}">
    <div class="row" >
  <form class="col s12">
      <div class="input-field col s6" >
      <div class="row"
        <div class="hey">Submit Homework and Comments</div>
      </div>
        <input id="hmwk${homeworkData.id}-url" type="text" class="validate" placeholder="Enter URL Here">
        <button class="btn btn-sm submit-hmwk" type="button" id="${homeworkData.id}" >Submit</button>
        </div>
    </div>
      </td></tr>
      </form>`;

    return newTr;
}

$("body").on("click", ".hmwkFormToggle", hwmkFormView);

let showForm = true;

function hwmkFormView() {
    //console.log("hmwkFORM click working");
    if (showForm === true) {
        $(`#hmwkForm-${this.id}`).hide();
        showForm = false;
    } else {
        $(`#hmwkForm-${this.id}`).show();
        showForm = true;
    }
}

function getHomework() {
    $.get("/api/homeworks").then(function(res) {
        //console.log(res);
        // get the current week
        let curr;
        let first;
        let last;
        let firstDay;
        let lastDay;
        curr = new Date(); // get current date

        first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        last = first + 14; // last day is the first day + 6

        firstDay = new Date(curr.setDate(first));
        lastDay = new Date(curr.setDate(last));
        //console.log(firstDay + " firstday", lastDay + " lastday");
        // currentWeek(13);

        let hmwkWeekArr = [];

        for (var i = 0; i < res.length; i++) {
            let dbFormatDate = new Date(res[i].due);
            if (
                dbFormatDate.getTime() >= firstDay.getTime() &&
                dbFormatDate.getTime() <= lastDay.getTime()
            ) {
                hmwkWeekArr.push(res[i]);
            }
        }
        //console.log(hmwkWeekArr, "here are homeworks matching our dates");

        let rowsToAdd = [];
        for (var i = 0; i < hmwkWeekArr.length; i++) {
            rowsToAdd.push(createHomeworkRow(hmwkWeekArr[i]));
        }
        //console.log("Rows to add: ", rowsToAdd);
        hmwkTable.append(rowsToAdd);
    });
}

// click event for homework
$("body").on("click", ".submit-hmwk", submitHomework);

////////////////////function to submit homework
function submitHomework() {
    event.preventDefault();
    console.log("submit hmwk click working");
    let submit = {
        student_id: userData.id,
        homework_id: this.id,
        url: $(`#hmwk${this.id}-url`)
            .val()
            .trim(),
        // url2: $(`#hmwk${this.id}-url2`)
        //     .val()
        //     .trim()
    };
    //console.log("hmwk obj: ", submit);
    $.post("/api/submitHMWK", submit).then(hmwkSubmitted);
    hmwkSubmitted();
}

function hmwkSubmitted() {
    $(`#hmwk${this.id}-url1`).val("");
    alert("Homework submitted....we will grade it whenever we feel like it.");
}