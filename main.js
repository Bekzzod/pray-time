let currentDate = new Date();
const currentDateFormatted = ('0' + currentDate.getDate()).slice(-2) + '-' + ('0' + (currentDate.getMonth()+1)).slice(-2) + '-' + currentDate.getFullYear();
const dateURL = `https://api.aladhan.com/v1/gToH?date=${currentDateFormatted}`;

function updateClock() {
  currentDate = new Date() // current date

  document.getElementById('hours').innerHTML = ('0' + currentDate.getHours()).slice(-2);
  document.getElementById('minutes').innerHTML = ('0' + currentDate.getMinutes()).slice(-2);

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
  const namazTimesURL = `https://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=0&month=${currentDate.getMonth() + 1}&year=${currentDate.getFullYear()}`;
  console.log(namazTimesURL);
  const response1 = await fetch(namazTimesURL);
  const data1 = await response1.json();
  
  data1.data.forEach(day => {
    if (day.date.gregorian.date == currentDateFormatted) {
      document.getElementById('fajr').innerHTML = day.timings.Fajr;
      document.getElementById('sunrise').innerHTML = day.timings.Sunrise;
      document.getElementById('dhuhr').innerHTML = day.timings.Dhuhr;
      document.getElementById('asr').innerHTML = day.timings.Asr;
      document.getElementById('maghrib').innerHTML = day.timings.Maghrib;
      document.getElementById('isha').innerHTML = day.timings.Isha;
    }
  });

  console.log(data1);
}
