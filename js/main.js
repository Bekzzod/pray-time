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
  ("0" + currentDate.getMinutes()).slice(-2);
const dateURL = `https://api.aladhan.com/v1/gToH?date=${currentDateFormatted}`;

function updateClock() {
  currentDate = new Date(); // current date

  document.getElementById("hours").innerHTML = (
    "0" + currentDate.getHours()
  ).slice(-2);
  document.getElementById("minutes").innerHTML = (
    "0" + currentDate.getMinutes()
  ).slice(-2);

  setTimeout(updateClock, 1000);
}

updateClock();

document.addEventListener("DOMContentLoaded", function() {
  getLocation(getNamazTimes);
});

function getLocation(callback) {
  navigator.geolocation.getCurrentPosition(function(position) {
    const returnValue = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };

    callback(returnValue.latitude, returnValue.longitude);
  });
}

async function getNamazTimes(latitude, longitude) {
  const namazTimesURL = `https://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=0&month=${currentDate.getMonth() +
    1}&year=${currentDate.getFullYear()}`;
  const response1 = await fetch(namazTimesURL);
  const data1 = await response1.json();

  data1.data.forEach(day => {
    if (day.date.gregorian.date == currentDateFormatted) {
      const timings = {
        fajr: day.timings.Fajr.split(" ")[0],
        sunrise: day.timings.Sunrise.split(" ")[0],
        dhuhr: day.timings.Dhuhr.split(" ")[0],
        asr: day.timings.Asr.split(" ")[0],
        maghrib: day.timings.Maghrib.split(" ")[0],
        isha: day.timings.Isha.split(" ")[0]
      };

      for (let [key, value] of Object.entries(timings)) {
        document.querySelector(`#${key} p`).innerHTML = value;
      }

      for (let [key, value] of Object.entries(timings)) {
        if (
          Date.parse(`01/01/2011 ${currentTimeFormatted}`) <
          Date.parse(`01/01/2011 ${value}`)
        ) {
          document.getElementById(key).style.backgroundColor =
            "var(--secondary-text-color)";
          break;
        }
        document.getElementById("isha").style.backgroundColor =
          "var(--secondary-text-color)";
      }
    }
  });
}
