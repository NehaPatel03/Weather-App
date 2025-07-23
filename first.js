
let map; 
document.getElementById('search-btn').addEventListener('click', function () {
    const city = document.getElementById('city').value.trim();
    const apiKey = '111b6cbf860b6a417c3d2ee9d9182fb1';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
       
    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Invalid API Key. Please check your API Key.");
                } else if (response.status === 404) {
                    throw new Error("City not found! Please check the spelling.");
                } else if (response.status === 429) {
                    throw new Error("API limit exceeded. Please wait and try again.");
                } else {
                    throw new Error(`Error: ${response.status}. Unable to fetch weather data.`);
                }
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('weather-info').style.display = 'block';
            document.getElementById('city-name').innerText = data.name;
            document.getElementById('description').innerText = `${data.weather[0].description}`;
            document.getElementById('temperature').innerText = `${data.main.temp}°C`;
            document.getElementById('humidity').innerHTML = `<i class="fa-solid fa-water"></i>  ${data.main.humidity}%`;
            document.getElementById('wind').innerHTML = `<i class="fa-solid fa-wind"></i>  ${data.wind.speed}km/h`;

            const weatherCondition = data.weather[0].main.toLowerCase();
            const weatherIcon = document.getElementById('weather-icon');
            weatherIcon.className = 'weather-icon';

            switch (weatherCondition) {
                case 'clear':
                    weatherIcon.classList.add('fa', 'fa-sun');
                    break;
                case 'clouds':
                    weatherIcon.classList.add('fa', 'fa-cloud');
                    break;
                case 'rain':
                    weatherIcon.classList.add('fa', 'fa-cloud-showers-heavy');
                    break;
                case 'snow':
                    weatherIcon.classList.add('fa', 'fa-snowflake');
                    break;
                case 'thunderstorm':
                    weatherIcon.classList.add('fa', 'fa-bolt');
                    break;
                case 'drizzle':
                    weatherIcon.classList.add('fa', 'fa-cloud-rain');
                    break;
                case 'mist':
                case 'fog':
                case 'haze':
                    weatherIcon.classList.add('fa', 'fa-smog');
                    break;
                default:
                    weatherIcon.classList.add('fa', 'fa-cloud');
                    break;
            }
            const lat = data.coord.lat;
            const lon = data.coord.lon;
            const mapContainer = document.getElementById('map');
            mapContainer.style.display = "block";


            if (map) {
                map.remove(); 
                map = null; 
            }

            mapContainer.innerHTML = ''; 

            map = L.map(mapContainer).setView([lat, lon], 10);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            
            L.marker([lat, lon]).addTo(map)
                .bindPopup(`<b>${data.name}</b><br>${data.weather[0].description}`)
                .openPopup();
        })
        .catch(error => {
            alert(error.message);
            console.error(error);
        });
});
