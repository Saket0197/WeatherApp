const yourWeather = document.querySelector('.your-weather');
const searchWeather = document.querySelector('.search-weather');
const searchForm = document.querySelector('.search-form');
const searchCity = document.querySelector('.search-city');
const searchBtn = document.querySelector('.search');
const grantAccessUi = document.querySelector('.grant-access-ui');
const accessBtn = document.querySelector('.access-btn');
const noWeatherInfo = document.querySelector('.no-weather-info');
const weatherInfo = document.querySelector('.weather-info');
const loader = document.querySelector('.loader');
const city = document.querySelector('[data-city-name]');
const flagIcon = document.querySelector('[data-city-flag]');
const weatherDesc = document.querySelector('[data-description]');
const weatherIcon = document.querySelector('[data-weather-icon]');
const temperature = document.querySelector('[data-temperature]');
const windspeed = document.querySelector('[data-windspeed]');
const humidity = document.querySelector('[data-humidity]');
const clouds = document.querySelector('[data-clouds]');

// Access Granted
function getCoords(position) {
    
    if(position.coords.longitude && position.coords.latitude) {
        let longi = position.coords.longitude.toString();
        let lati = position.coords.latitude.toString();
        let coordinates = {};
        coordinates['longitude'] = longi;
        coordinates['latitude'] = lati;
        sessionStorage.setItem('coordinates',JSON.stringify(coordinates));
        if(grantAccessUi.classList.contains('display')) {
            grantAccessUi.classList.remove('display');
        }
        fetchData(lati,longi);
    }

}

// Access NOT Granted
function coordsNotFound(){

    if(weatherInfo.classList.contains('display')){
        weatherInfo.classList.remove('display');
    }
    grantAccessUi.classList.add('display');

}

// rendering received response on UI
function renderResponse(response) {

    if(response === null) {
        if(weatherInfo.classList.contains('display')){
            weatherInfo.classList.remove('display');
        }
        noWeatherInfo.classList.add('display');
        return;
    }

    city.textContent = response?.name;
    flagIcon.src = `https://flagcdn.com/144x108/${response?.sys?.country.toLowerCase()}.png`;
    weatherDesc.textContent = response?.weather?.[0].description;
    weatherIcon.src = `https://openweathermap.org/img/w/${response?.weather?.[0].icon}.png`;
    temperature.textContent = (Number(response?.main?.temp) - 273).toFixed(2).toString() + '°C';
    windspeed.textContent = response?.wind?.speed + 'm/s';
    humidity.textContent = response?.main?.humidity + '%';
    clouds.textContent = response?.clouds?.all + '%';

    if(noWeatherInfo.classList.contains('display')) {
        noWeatherInfo.classList.remove('display');
    }
    weatherInfo.classList.add('display');

}

// fetching data from api
async function fetchData(lati=null,longi=null,cityName=null){

    const api_key = 'd1845658f92b31c64bd94f06f7188c9c';
    let api_url = null;

    loader.classList.add('display');
    
    if(lati !== null && longi !== null) {
        api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${longi}&appid=${api_key}`;
    }
    else if(cityName !== null) {
        api_url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${api_key}`;
    }
    else{
        loader.classList.remove('display');
        renderResponse(null);
        return;
    }

    try{
        let result = await fetch(api_url);
        let response = await result.json();
        loader.classList.remove('display');
        if(response.cod === '404'){
            renderResponse(null);
            return;
        }
        renderResponse(response);

    } catch(err) {
        console.log('Error while fetching data');
        console.error(err.message);
    }

}

// Switching Between Search options
function switchTabs() {

    if(searchWeather.checked) {
        if(grantAccessUi.classList.contains('display')){
            grantAccessUi.classList.remove('display');
        }
        else if(weatherInfo.classList.contains('display')){
            weatherInfo.classList.remove('display');
        }
        if(!searchForm.classList.contains('display')) {
            searchForm.classList.add('display');
        }
    }
    else{
        initiate();
    }

}

// Initializing UI
function initiate(){

    if(yourWeather.checked) {
        navigator.geolocation.getCurrentPosition(getCoords,coordsNotFound);
        if(searchForm.classList.contains('display')) {
            searchForm.classList.remove('display');
        }
    }

}

yourWeather.addEventListener('click',() => {
    switchTabs();
});

searchWeather.addEventListener('click',() => {
    switchTabs();
});

accessBtn.addEventListener('click',() => {
    initiate();
});

searchBtn.addEventListener('click',() => {
    fetchData(null,null,searchCity.value);
});

// submitting form data
searchForm.addEventListener('submit',(event)=>{
    event.preventDefault();
    fetchData(null,null,searchCity.value);
    
});

initiate();