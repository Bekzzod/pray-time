let currentDate = new Date();
const currentDateFormatted =
  ("0" + currentDate.getDate()).slice(-2) +
  "-" +
  ("0" + (currentDate.getMonth() + 1)).slice(-2) +
  "-" +
  currentDate.getFullYear();
const currentTimeFormatted =
  ("0" + currentDate.getHours()).slice(-2) +
  ":" +
  ("0" + currentDate.getMinutes()).slice(-2) +
  ":" +
  ("0" + currentDate.getSeconds()).slice(-2);
const dateURL = `https://api.aladhan.com/v1/gToH?date=${currentDateFormatted}`;

function updateClock() {
  currentDate = new Date(); // current date
  document.getElementById("currentTime").innerHTML =
    ("0" + currentDate.getHours()).slice(-2) +
    ":" +
    ("0" + currentDate.getMinutes()).slice(-2) +
    ":" +
    ("0" + currentDate.getSeconds()).slice(-2);

  setTimeout(updateClock, 1000);
}

updateClock();

document.addEventListener("DOMContentLoaded", function () {
  getMethods();
  getLocation(getNamazTimes);
});

function getLocation(callback) {
  navigator.geolocation.getCurrentPosition(function (position) {
    const returnValue = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };

    callback(returnValue.latitude, returnValue.longitude);
  });
}

async function getNamazTimes(latitude, longitude) {
  console.log(Date.now());
  const namazTimesURL = `https://api.aladhan.com/v1/timings/${Date.now()}?latitude=${latitude}&longitude=${longitude}`;
  const apiResponse = await fetch(namazTimesURL);
  const responseJSON = await apiResponse.json();
  const responseData = responseJSON.data;

  const timings = {
    fajr: responseData.timings.Fajr.split(" ")[0],
    sunrise: responseData.timings.Sunrise.split(" ")[0],
    dhuhr: responseData.timings.Dhuhr.split(" ")[0],
    asr: responseData.timings.Asr.split(" ")[0],
    maghrib: responseData.timings.Maghrib.split(" ")[0],
    isha: responseData.timings.Isha.split(" ")[0],
  };

  for (let [key, value] of Object.entries(timings)) {
    document.querySelector(`#${key} p`).innerHTML = value;
  }

  for (let [key, value] of Object.entries(timings)) {
    let startDate = new Date().getTime()
    let endDate = new Date(`${currentDate.getFullYear()}-${("0" + (currentDate.getMonth() + 1)).slice(-2)}-${("0" + currentDate.getDate()).slice(-2)}T${value}:00`).getTime();
  
    if (startDate < endDate) {
      const diff = endDate - startDate;
      const seconds = Math.floor(diff / 1000);

      document.getElementById(key).style.backgroundColor = "var(--secondary-text-color)";
      document.getElementById(key + "TimeLeft").innerHTML = seconds;
      break;
    }
    //document.getElementById("isha").style.backgroundColor =
    //"var(--secondary-text-color)";
  }
}

async function getMethods() {
  const selectElement = document.querySelector("#method");

  const calculationMethodsURL = `http://api.aladhan.com/v1/methods`;
  const response = await fetch(calculationMethodsURL);
  const data = await response.json();

  console.log(data.data);

  Object.keys(data.data).forEach((key) => {
    if (data.data[key].hasOwnProperty("name")) {
      var opt = document.createElement("option");
      opt.value = data.data[key].name;
      opt.innerHTML = data.data[key].name;
      selectElement.appendChild(opt);
    }
  });
}
