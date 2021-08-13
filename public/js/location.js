const locationBtn = document.querySelector('#location-btn')
const locationInput = document.querySelector("#location")
function showPosition(position) {
  const { latitude, longitude } = position.coords;
  locationInput.value = `http://www.google.com/maps/place/${latitude},${longitude} (${latitude}, ${longitude})`
}
function getLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          // Success function
          showPosition, 
          // Error function
          null, 
          // Options. See MDN for details.
          {
             enableHighAccuracy: true,
             timeout: 3000,
             maximumAge: 0
          });
  } else { 
      alert("Geolocation is not supported by this browser.");
  }
}

locationBtn.addEventListener('click', getLocation)