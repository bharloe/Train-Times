// Initialize Firebase
var config = {
  apiKey: "AIzaSyA-M2PTR2ofMOGmIUsUfsnLWKRbzgTybEM",
  authDomain: "firstdemo-50373.firebaseapp.com",
  databaseURL: "https://firstdemo-50373.firebaseio.com",
  projectId: "firstdemo-50373",
  storageBucket: "firstdemo-50373.appspot.com",
  messagingSenderId: "378287110009"
};
firebase.initializeApp(config);

var database = firebase.database();

var employeesRef = database.ref("/employeeData");

var name = "";
var destination = "";
var startTime = "";
var frequency = 0;
var total = 0;
var minutesAway = 0;
var nextTrain = "";

$(document).ready(function() {
  $("#submit-btn").on("click", function(event) {
    event.preventDefault();

    getparams();
    database.ref("/employeeData").push({
      name: name,
      destination: destination,
      startTime: startTime,
      frequency: frequency
    });
  });
});

database.ref("/employeeData").on("child_added", function(childSnapshot) {
  // If Firebase has a highPrice and highBidder stored (first case)
  if (
    childSnapshot.child("name").exists() &&
    childSnapshot.child("destination").exists()
  ) {

    // Set the local variables for highBidder equal to the stored values in firebase.
    name = childSnapshot.val().name;
    destination = childSnapshot.val().destination;
    startTime = childSnapshot.val().startTime;
    frequency = Number(childSnapshot.val().frequency);

    calculateTime();
    addTrain(name, destination, startTime, minutesAway, frequency, total);
  }
});

function addTrain(
  name,
  destination,
  startTime,
  minutesAway,
  frequency,
  total
) {
  var employeeRow = $("<tr>");
  var nameTd = $("<td>" + name + "</td>");
  var destinationTd = $("<td>" + destination + "</td>");
  var frequencyTd = $("<td>" + frequency + "</td>");
  var nextTrainTd = $("<td>" + nextTrain + "</td>");
  var minutesAwayTd = $("<td>" + minutesAway + "</td>");

  employeeRow.append(nameTd);
  employeeRow.append(destinationTd);
  employeeRow.append(frequencyTd);
  employeeRow.append(nextTrainTd);
  employeeRow.append(minutesAwayTd);

  $("#train-info").append(employeeRow);
}

function getparams() {
  name = $("#name")
    .val()
    .trim();
  destination = $("#destination")
    .val()
    .trim();
  startTime = $("#start-time")
    .val()
    .trim();
  frequency = $("#frequency")
    .val()
    .trim();
}

function calculateTime() {


  //current time minus start time in minutes

  // minutesAway = JSON.stringify(moment(today).diff(startTime, "minutes"));
  // total = JSON.stringify(minutes * frequency);


  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(startTime, "hh:mm").subtract(1, "years");
  console.log(firstTimeConverted);
  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);
  // Time apart (remainder)
  var tRemainder = diffTime % frequency;
  console.log(tRemainder);
  // Minute Until Train
  minutesAway = frequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + minutesAway);
  // Next Train
  var nextTrainCalc = moment().add(minutesAway, "minutes");
  nextTrain = moment(nextTrainCalc).format("hh:mm");
  console.log("ARRIVAL TIME: " + moment(nextTrainCalc).format("hh:mm"));
}
