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
// vars homework container
let hmwkTable = $("#table-homework");
getHomework();

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
      <td id="hmwkForm-icon${homeworkData.id}">
    <form class="col s12">
      <div class="row" >
        <div class="input-field col s6" >
            <div class="row"
                <div class="hey">Submit Homework and Comments</div>
            </div>
            <input id="hmwk${homeworkData.id}-url" type="text" class="validate" placeholder="Enter URL Here">
        </div>
        <button class="btn btn-sm submit-hmwk" type="button" id="${homeworkData.id}">Submit</button>
      </div>
        </td></tr>
        </form>`;

    return newTr;
}

$("body").on("click", ".hmwkFormToggle", hwmkFormView);

let showForm = true;

function hwmkFormView() {
    console.log("hmwkFORM click working");
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
        console.log(res);
        // get the current week
        //   let curr;
        //   let first;
        //   let last;
        //   let firstDay;
        //   let lastDay;
        //   curr = new Date(); // get current date

        //   first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
        //   last = first + 14; // last day is the first day + 6

        //   firstDay = new Date(curr.setDate(first));
        //   lastDay = new Date(curr.setDate(last));
        //   console.log(firstDay + " firstday", lastDay + " lastday");
        // currentWeek(13);

        let hmwkWeekArr = [];

        for (var i = 0; i < res.length; i++) {
            // let dbFormatDate = new Date(res[i].due);
            // if (
            //   dbFormatDate.getTime() >= firstDay.getTime() &&
            //   dbFormatDate.getTime() <= lastDay.getTime()
            // ) {
            hmwkWeekArr.push(res[i]);
            // }
        }
        console.log(hmwkWeekArr, "here are homeworks matching our dates");

        let rowsToAdd = [];
        for (var i = 0; i < hmwkWeekArr.length; i++) {
            rowsToAdd.push(createHomeworkRow(hmwkWeekArr[i]));
        }
        console.log("Rows to add: ", rowsToAdd);
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
            .trim()
    };
    // url2: $(`#hmwk${this.id}-url2`)
    //     .val()
    //     .trim()
    console.log("hmwk obj: ", submit);
    $.post("/api/submitHMWK", submit).then(hmwkSubmitted);
}

function hmwkSubmitted() {
    $(`#hmwk${this.id}-url1`).val("");
    $(`#hmwk${this.id}-url2`).val("");
    alert("Homework submitted....we will grade it whenever we feel like it.");
}