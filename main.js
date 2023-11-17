'use strict'

const API_KEY = '966afed3abd749cf8dd62743231711';
const API_URL = 'https://api.weatherapi.com/v1/current.json?';
const form = document.querySelector('.form');
const formInput = document.querySelector('.form__input');
const loading = document.querySelector('.dot-pulse');
const weather = document.createElement('div');
const enterName = document.querySelector('.enter-name')



// Listeners 
form.addEventListener('submit', getWeather)



// Functions

async function getWeather(e) {
    e.preventDefault();
    const value = formInput.value;
    const noMatching = document.querySelector('.no-matching');
    loading.classList.remove('dot-pulse_non-active')
    enterName.classList.add('enter-name_non-active')
    formInput.disabled = true;
    formInput.placeholder = 'Wait...'
    weather.classList.add('weather_non-active')
    noMatching.classList.add('no-matching_non-active')

    setBackToDefault()
    try {

        const response = await fetch(`${API_URL}key=${API_KEY}&q=${value}`);
        const res = await response.json();
        updateWeather(res)
        noMatching.classList.add('no-matching_non-active');


    } catch (error) {

        console.error("Ошибка при получении данных:", error);
        noMatching.classList.remove('no-matching_non-active');
        document.querySelector('.container').removeChild(weather)


    } finally {
        loading.classList.add('dot-pulse_non-active');
        enterName.classList.add('enter-name_non-active');
        formInput.disabled = false;
        formInput.placeholder = 'Search for a city...'
        weather.classList.remove('weather_non-active')
    }
}




function updateWeather(data) {
    weather.classList.add('weather')
    weather.classList.add('block_basic')
    const roundedDegree = Math.round(data.current.temp_c);
    const roundedFeelsLike = Math.round(data.current.feelslike_c)

    const localtime = data.location.localtime.split(' ')
    const [date, time] = localtime
    const now = new Date(date)
    const timeNow = time

    const formattedDate = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    weather.innerHTML = `
        <div class="weather__city-country">
            <h1 class="weather__title">${data.location.name},
            <span class="weather__subtitle"> ${data.location.country}</span>
            </h1>
            <span class="weather__date">${formattedDate}</span>
            <span class="weather__time">${timeNow}</span>
        </div>
        <div class="weather__degree">
            <div class="weather__temperature">
                <img
                src="https:${data.current.condition.icon}"
                alt="weather"
                class="weather__img"><h2 class="weather__temperature-degree">${roundedDegree} °c</h2>
            </div>
            <span class="weather__temperature-description">${data.current.condition.text}</span>
        </div>
        <div class="weather__feels-like">
            <span class="weather__feels">Feels like: ${roundedFeelsLike} °c</span>
            <span class="weather__humidity">Humidity: ${data.current.humidity}%</span>
            <span class="weather__wind">Wind: ${data.current.wind_kph} kph</span>
        </div>
    `
    document.querySelector('.container').append(weather)
}

function setBackToDefault() {
    formInput.value = ''
}