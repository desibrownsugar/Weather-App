const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(
  ".grant-location-container"
);
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

function showError(message) {
  const errorContainer = document.querySelector("[data-errorContainer]");
  const weatherInfo = document.querySelector(".user-info-container");
  const loadingScreen = document.querySelector(".loading-container");
  const grantAccess = document.querySelector(".grant-location-container");

  // Hide other sections
  weatherInfo.classList.remove("active");
  loadingScreen.classList.remove("active");
  grantAccess.classList.remove("active");

  // set the custom message in the error container
  const errorMsg = document.querySelector("[data-errorMsg]");
  if (errorMsg) errorMsg.textContent = message;
  // Show error container
  errorContainer.style.display = "flex";
}

// jis jis chiz pe hame action karwana hai us us ko document me query selector ke madad se
// store karwa lenge like search button ko click karwake uspe event listener lagega
// so iska matlab usko bhi document me query selector ke madad se karwana parega
//initially vaible ka need?

let oldTab = userTab;
const API_KEY = "f927e23f38f9e7d29314c435ef3961d6";
oldTab.classList.add("current-tab");

function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem("user-coordinates");
  if (!localCoordinates) {
    //agar local coordinates nahi mile
    grantAccessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
    //fetchuserWeather ek function h
  }
}
getfromSessionStorage();

//switchTab function is used to switch between user and search tab
function switchTab(newTab) {
  document.querySelector("[data-errorContainer]").style.display = "none";
  if (newTab != oldTab) {
    oldTab.classList.remove("current-tab");
    oldTab = newTab;
    oldTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      //kya search form wala container is invisible, if yes then make it visible
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      //main pehle search wale tab pr tha, ab your weather tab visible karna h
      searchForm.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      userInfoContainer.classList.remove("active");
      //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
      //for coordinates, if we haved saved them there.
      getfromSessionStorage();
      // why getsessionstorage Because we are resetting everything that might be showing, including previously displayed weather info.
    }
  }
}

userTab.addEventListener("click", () => {
  //pass clicked tab as input parameter
  switchTab(userTab);
});
searchTab.addEventListener("click", () => {
  //pass clicked tab as input parameter
  switchTab(searchTab);
});
// If the user clicks userTab, the switchTab(userTab) is called.
// If they click searchTab, then switchTab(searchTab) is called.
// And the switchTab() function compares the clicked tab with the currently active tab
// (currentTab) and handles UI changes accordingly.
// matlab agar usertab pe click kiye toh fir wo fucntion call kar diye agar pehle wala
//  oldTab bhi same tha to koi change nahi agar alag tha toh change according to the
//  switch function

async function fetchUserWeatherInfo(coordinates) {
  document.querySelector("[data-errorContainer]").style.display = "none";

  const { lat, lon } = coordinates;

  //make grant container invisible
  grantAccessContainer.classList.remove("active");
  //make loader visible
  loadingScreen.classList.add("active");

  //API CALL
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();

    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    loadingScreen.classList.remove("active");
  }
}

function renderWeatherInfo(weatherInfo) {
  //firstly we have to fetch the elements
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon]");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windspeed = document.querySelector("[data-windspeed]");
  const humidity = document.querySelector("[data-humidity]");
  const cloudiness = document.querySelector("[data-cloudiness]");
  console.log(weatherInfo);

  //fetch values from weatherINfo object and put it UI elements
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  //  Dynamically loads the country flag based on country code (e.g., IN for India).
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  //  Shows the weather condition icon (e.g., cloud/sun image)

  temp.innerText = `${weatherInfo?.main?.temp} °C`;
  //  Temperature in Celsius.
  windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

  //? isko bolte h chaining isse agar suppose wo varibale kaam nahi kiye kuch bhi garbar
  //hogaya to undefined show hoga atleast code toh chaleg
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    //html-show an alert for no geolocation support available
    alert("Your browser does not support geolocation.");
  }
}
function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

const searchInput = document.querySelector("[data-searchInput]");

const grantAccessButton = document.querySelector("[data-grantAccess]");
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;

  if (cityName === "") return;
  else fetchSearchWeatherInfo(cityName);
});
grantAccessButton.addEventListener("click", getLocation);

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");
  // Hide any previous error
  document.querySelector("[data-errorContainer]").style.display = "none";

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    // If city not found
    if (data.cod === "404") {
      loadingScreen.classList.remove("active");
      showError("City not found. Please try again.");
      return;
    }
    //  If city found, show weather

    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    //  Catch API or internet error
    loadingScreen.classList.remove("active");
    showError("Something went wrong. Please try again.");
  }
}
