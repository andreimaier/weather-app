const weatherIcon = document.querySelector('.weather-icon');
const degrees = document.querySelector('.degrees');
const cityName = document.querySelector('.city-name');
const humidityVal = document.querySelector('.humidity');
const inputSearch = document.querySelector('.input-search');
const buttonSearch = document.querySelector('.button-search');
const wind = document.querySelector('.wind');
const displayCard = document.querySelector('main');

const APIkey = 'a62efa4030ce598957e7558850818388';


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
    } else {
        alert("Geolocation is not supported by this browser.")
    }
}
getLocation()

async function searchWeather(cityName, APIkey) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIkey}&units=metric`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

async function getLocalWeather(APIkey, lon, lat) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
}

function showPosition(position) {
    const lat = position.coords.latitude
    const lon = position.coords.longitude
    try {
        getLocalWeather(APIkey, lon, lat).then(data => {
            if (data.cod === 200) {
                const { name, sys, wind, main, weather } = data
                const cityWeather = {
                    'city': name,
                    'temp': Math.floor(main.temp),
                    'country': sys.country,
                    'wind': wind.speed,
                    'humidity': main.humidity,
                    'iconCode': weather[0].icon,
                }
                wind.textContent = cityWeather.wind + ' km/h'
                degrees.textContent = cityWeather.temp + '°C';
                cityName.textContent = cityWeather.city + ' | ' + cityWeather.country;
                humidityVal.textContent = cityWeather.humidity + '%';
                weatherIcon.src = `https://openweathermap.org/img/wn/${cityWeather.iconCode}@2x.png`
            } else {
                alert('error')
            }
        })
    } catch (e) {
        console.error(e)
    }
}

buttonSearch.addEventListener('click', async () => {
    try {
        const searchedCity = inputSearch.value
        searchWeather(searchedCity, APIkey)
            .then(data => {
                if (data.cod === 200) {
                    const { name, sys, wind, main, weather } = data
                    const cityWeather = {
                        'city': name,
                        'temp': Math.floor(main.temp),
                        'country': sys.country,
                        'wind': wind.speed,
                        'humidity': main.humidity,
                        'iconCode': weather[0].icon,
                    }
                    storeCurrentCity(cityWeather)
                    updateDOM()

                    inputSearch.value = ''
                } else {
                    alert('error')
                }
            })
    } catch (e) {
        console.error(e)
    }
})
inputSearch.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        buttonSearch.click()
    }
})

const savedCities = []
function storeCurrentCity(currentCity) {
    savedCities.push(currentCity)
    localStorage.setItem('savedCities', JSON.stringify(savedCities))
}

console.log(localStorage.getItem('savedCities'))

function updateDOM() {
    const citiesData = JSON.parse(localStorage.getItem('savedCities'))
    let htmlCard = ''
    for (let i = 0; i < citiesData.length; i++) {
        const card = createCard(citiesData[i])
        htmlCard += card
    }
    displayCard.innerHTML = htmlCard
}
updateDOM()

function createCard(element) {
    const { city, temp, country, wind, humidity, iconCode } = element
    const htmlCard = `
<div class="card">
    <p>
      <img
        class="weather-icon mainIcon"
        src="https://openweathermap.org/img/wn/${iconCode}@2x.png"
      />
    </p>
    <div>
      <p class="degrees">${temp}°</p>
      <p class="city-name">${city} | ${country}</p>
    </div>
    <div class='weather-details'>
      <div class="details__humidity">
        <i class="fa-solid fa-water"></i>
        <div>
          <p class="humidity">${humidity}</p>
         
        </div>
      </div>
      <div class="details__wind">
        <i class="fa-solid fa-wind"></i>
        <div>
          <p class="wind">${wind} km/h</p>
         
        </div>
      </div>
    </div>
</div>`
    return htmlCard
}