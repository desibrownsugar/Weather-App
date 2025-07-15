const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container")


// jis jis chiz pe hame action karwana hai us us ko document me query selector ke madad se 
// store karwa lenge like search button ko click karwake uspe event listener lagega
// so iska matlab usko bhi document me query selector ke madad se karwana parega 
//initially vaible ka need?



let oldTab = userTab;
const API_KEY = "f927e23f38f9e7d29314c435ef3961d6";
oldTab.classList.add("current-tab");


function getfromSessionStorage() {
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        //agar local coordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
        //fetchuserWeather ek function h 
    }

}
getfromSessionStorage();

// 🔍 What Is This Function’s Purpose?
// This function:

// Tries to get your saved coordinates (latitude and longitude) from the browser’s sessionStorage.

// If it finds them, it fetches your weather info.

// If it doesn’t find them, it shows the UI asking you to grant location access.

// 🧠 Now Let’s Go Line by Line:
// 🔸 function getfromSessionStorage() {
// This is just declaring a named function called getfromSessionStorage.

// It will be called later (when we switch to the “Your Weather” tab).

// 🔸 const localCoordinates = sessionStorage.getItem("user-coordinates");
// This line tries to get the stored coordinates from the browser's sessionStorage.

// sessionStorage is a built-in web API that stores data only until the tab is open.

// 🔹 What is "user-coordinates"?
// It's a key used to save and retrieve your location data.

// The value stored is a stringified object (using JSON.stringify() earlier in the app).

// 🔸 if (!localCoordinates) {
// If nothing is found in sessionStorage (i.e., localCoordinates is null or empty),

// Then this means the user has not allowed location access yet, or it's not saved.

// 🔸 grantAccessContainer.classList.add("active");
// This makes the "Grant Location Access" container visible.

// The container is probably hidden by default using CSS.

// 🔔 This is a visual signal to the user: "Hey, we need your location to show the weather."

// 🔸 } else {
// If we do have the coordinates saved,

// That means the user has already granted location access before (in this session).

// 🔸 const coordinates = JSON.parse(localCoordinates);
// The value stored in sessionStorage is a string.

// So we use JSON.parse() to convert it back into an object like:
// {
//   lat: 19.07,
//   lon: 72.87
// }
// 🔸 fetchUserWeatherInfo(coordinates);
// This calls another function (defined elsewhere in the app) that uses your latitude & longitude to fetch the weather.

// Likely via a weather API (like OpenWeatherMap).












function switchTab(newTab){
    if(newTab != oldTab){
        oldTab.classList.remove("current-tab")
        oldTab = newTab;
        oldTab.classList.add("current-tab")

    

//  Full Concept in Your Words (Refined)
// We start on the default tab (for example, the User Weather tab).
// So we store that tab into a variable called oldTab.

// Then, we create a function called switchTab(newTab) which accepts the tab the user just clicked.

// Inside the function:

// We compare:
// 👉 “Is the newly clicked tab (newTab) the same as the previous one (oldTab)?”

// If it’s different, that means the user wants to switch tabs.

// So, we do three things:

// ❌ Remove the highlight ("current-tab" class) from the old tab
// → This makes it look unselected.

// 🔁 Update oldTab = newTab
// → So we remember that the new tab is now the “current” tab.

// ✅ Add the highlight ("current-tab" class) to the new tab
// → This makes the new tab look selected/active.

// 🔦 Why We Do This?
// Because visually, only one tab should look “selected” at a time.
// And functionally, we need to show/hide the right content based on what the user wants.
if(!searchForm.classList.contains("active")){
    //kya search form wala container is invisible, if yes then make it visible
userInfoContainer.classList.remove("active");
grantAccessContainer.classList.remove("active");
searchForm.classList.add("active");
}
else{
    //main pehle search wale tab pr tha, ab your weather tab visible karna h 
    searchForm.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    userInfoContainer.classList.remove("active");
     //ab main your weather tab me aagya hu, toh weather bhi display karna poadega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getfromSessionStorage();
            // why getsessionstorage Because we are resetting everything that might be showing, including previously displayed weather info.

// Then we call:
// getFromSessionStorage();
// And this function will decide:

// If we have coordinates, show userInfoContainer (weather)

// If not, show grantAccessContainer

// So removing both ensures a clean slate, then we show the right container based on condition.
// upar defined h ye function
}
    }
}

userTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter 
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(searchTab)
})
// If the user clicks userTab, the switchTab(userTab) is called.
// If they click searchTab, then switchTab(searchTab) is called.
// And the switchTab() function compares the clicked tab with the currently active tab 
// (currentTab) and handles UI changes accordingly.
// matlab agar usertab pe click kiye toh fir wo fucntion call kar diye agar pehle wala
//  oldTab bhi same tha to koi change nahi agar alag tha toh change according to the 
//  switch function

async function fetchUserWeatherInfo(coordinates){
    const{lat,lon} = coordinates;
    
    //make grant container invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

//API CALL
try{
    const response = await fetch( `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active")
    renderWeatherInfo(data);
}
catch(err){
    loadingScreen.classList.remove("active");

}
}

function renderWeatherInfo(weatherInfo){
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

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);

    }
    else{
        //html-show an alert for no geolocation support available 
       alert("Your browser does not support geolocation.");
    }
}
function showPosition(position){
    const userCoordinates = {
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }

     sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

const searchInput = document.querySelector("[data-searchInput]");


const grantAccessButton = document.querySelector("[data-grantAccess]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);


//  Final Flow Summary (Simple Language):
// The user can either:

// Click “Grant Access” to allow the app to detect their current location, or

// Type a city name and submit the form.

// If they click the Grant Access button:

// getLocation() is called

// It gets their current coordinates

// It fetches weather info for their real location

// If they type a city and hit submit:

// The form won’t reload the page (preventDefault)

// Your code gets the city name they typed

// It fetches the weather for that city







})
grantAccessButton.addEventListener("click", getLocation);

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        //hW
         loadingScreen.classList.remove("active");
        alert("City not found. Please try again.");
    }
}








// 📜 Built-in Functions in Your Code
// Here's a list of the built-in browser/web functions used in your code so far:

// Function / Object	Type	What it does
// navigator	Object	Info about the browser
// navigator.geolocation	Object	Interface to location API access de raha mera location ka api ko
// getCurrentPosition()	Method	Gets user location (async) mera show position wala function call horaha h
// alert()	Function	Pops up a browser alert
// sessionStorage.setItem()	Method	Saves data temporarily in browser tab
// JSON.stringify()	Function	Converts JS object → string
// document.querySelector()	Method	Selects an HTML element
// addEventListener()	Method	Adds event listeners (like click, submit)
// preventDefault()	Method	Prevents default form behavior
// fetch()	Method	Sends HTTP requests (used for API calls)
// response.json()	Method	Parses JSON body of HTTP response

// 🛑 No, getLocation() is not a built-in function — it is a custom function written by you.