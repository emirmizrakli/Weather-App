const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const locationButton = document.getElementById('location-button');
const favoriteButton = document.getElementById('favorite-btn');
const celsiusButton = document.getElementById('celsius');
const fahrenheitButton = document.getElementById('fahrenheit');
const weatherIcon = document.querySelector('.weather-icon i');
const tempElement = document.getElementById('temp');
const unitElement = document.querySelector('.unit');
const descriptionElement = document.getElementById('description');
const cityElement = document.getElementById('city');
const windElement = document.getElementById('wind');
const humidityElement = document.getElementById('humidity');
const pressureElement = document.getElementById('pressure');
const hourlyContainer = document.getElementById('hourly-container');
const dailyContainer = document.getElementById('daily-container');
const favoritesContainer = document.getElementById('favorites-container');

let isCelsius = true;
let currentCity = '';
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Hava durumu ikonlarını belirleme fonksiyonu
function getWeatherIcon(weatherCode) {
    const codes = {
        0: 'fa-sun', // Açık
        1: 'fa-cloud-sun', // Az bulutlu
        2: 'fa-cloud', // Parçalı bulutlu
        3: 'fa-cloud', // Kapalı
        45: 'fa-smog', // Sisli
        48: 'fa-smog', // Yoğun sisli
        51: 'fa-cloud-rain', // Hafif çisenti
        53: 'fa-cloud-rain', // Orta çisenti
        55: 'fa-cloud-showers-heavy', // Yoğun çisenti
        61: 'fa-cloud-rain', // Hafif yağmur
        63: 'fa-cloud-showers-heavy', // Orta yağmur
        65: 'fa-cloud-showers-heavy', // Yoğun yağmur
        71: 'fa-snowflake', // Hafif kar
        73: 'fa-snowflake', // Orta kar
        75: 'fa-snowflake', // Yoğun kar
        77: 'fa-snowflake', // Kar taneleri
        80: 'fa-cloud-showers-heavy', // Hafif sağanak
        81: 'fa-cloud-showers-heavy', // Orta sağanak
        82: 'fa-cloud-showers-heavy', // Yoğun sağanak
        85: 'fa-snowflake', // Hafif kar sağanağı
        86: 'fa-snowflake', // Yoğun kar sağanağı
        95: 'fa-bolt', // Gök gürültülü fırtına
        96: 'fa-bolt', // Hafif dolu ile gök gürültülü fırtına
        99: 'fa-bolt' // Yoğun dolu ile gök gürültülü fırtına
    };
    return codes[weatherCode] || 'fa-cloud-sun';
}

// Hava durumu açıklamalarını Türkçe'ye çevirme
function getWeatherDescription(weatherCode) {
    const descriptions = {
        0: 'Açık',
        1: 'Az Bulutlu',
        2: 'Parçalı Bulutlu',
        3: 'Kapalı',
        45: 'Sisli',
        48: 'Yoğun Sisli',
        51: 'Hafif Çisenti',
        53: 'Orta Çisenti',
        55: 'Yoğun Çisenti',
        61: 'Hafif Yağmur',
        63: 'Orta Yağmur',
        65: 'Yoğun Yağmur',
        71: 'Hafif Kar',
        73: 'Orta Kar',
        75: 'Yoğun Kar',
        77: 'Kar Taneleri',
        80: 'Hafif Sağanak',
        81: 'Orta Sağanak',
        82: 'Yoğun Sağanak',
        85: 'Hafif Kar Sağanağı',
        86: 'Yoğun Kar Sağanağı',
        95: 'Gök Gürültülü Fırtına',
        96: 'Hafif Dolu ile Gök Gürültülü Fırtına',
        99: 'Yoğun Dolu ile Gök Gürültülü Fırtına'
    };
    return descriptions[weatherCode] || 'Bilinmeyen';
}

// Sıcaklık dönüştürme
function convertTemperature(temp) {
    return isCelsius ? temp : (temp * 9/5) + 32;
}

// Hava durumuna göre tema ve animasyonlu ikon ayarla
function setWeatherThemeAndIcon(weatherCode, isNight = false) {
    const bg = document.getElementById('animated-bg');
    const iconDiv = document.getElementById('weather-anim-icon');
    let theme = 'bg-sunny';
    let iconSVG = '';

    // Gece kontrolü (örnek: 20:00-06:00 arası gece say)
    const hour = new Date().getHours();
    if (isNight === undefined) {
        isNight = (hour >= 20 || hour < 6);
    }

    // Tema ve ikon seçimi
    if (weatherCode === 0) { // Açık
        theme = isNight ? 'bg-night' : 'bg-sunny';
        iconSVG = isNight ? getMoonSVG() : getSunSVG();
    } else if ([1, 2, 3, 45, 48].includes(weatherCode)) { // Bulutlu
        theme = isNight ? 'bg-night' : 'bg-cloudy';
        iconSVG = getCloudSVG();
    } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode)) { // Yağmurlu
        theme = 'bg-rainy';
        iconSVG = getRainSVG();
    } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) { // Karlı
        theme = 'bg-snowy';
        iconSVG = getSnowSVG();
    } else if ([95, 96, 99].includes(weatherCode)) { // Fırtına
        theme = 'bg-thunder';
        iconSVG = getThunderSVG();
    } else {
        theme = 'bg-cloudy';
        iconSVG = getCloudSVG();
    }

    // Temayı uygula
    if(bg) bg.className = theme;
    // Animasyonlu ikonu uygula
    if(iconDiv) {
        iconDiv.innerHTML = iconSVG;
        iconDiv.style.opacity = 0;
        setTimeout(() => { iconDiv.style.transition = 'opacity 0.7s'; iconDiv.style.opacity = 1; }, 50);
    }
}

// SVG Animasyon Fonksiyonları
function getSunSVG() {
    return `<svg class="sunny-svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="22" fill="#FFD700"/><g stroke="#FFD700" stroke-width="4">${[...Array(8)].map((_,i)=>`<line x1="50" y1="10" x2="50" y2="0" transform="rotate(${i*45} 50 50)"/>`).join('')}</g></svg>`;
}
function getMoonSVG() {
    return `<svg class="night-svg" viewBox="0 0 100 100"><circle cx="60" cy="50" r="22" fill="#fffbe6"/><circle cx="70" cy="50" r="18" fill="#232526"/></svg>`;
}
function getCloudSVG() {
    return `<svg class="cloudy-svg" viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="30" ry="18" fill="#fff" opacity="0.8"/><ellipse cx="70" cy="60" rx="18" ry="14" fill="#e0e0e0" opacity="0.8"/><ellipse cx="35" cy="65" rx="15" ry="10" fill="#e0e0e0" opacity="0.7"/></svg>`;
}
function getRainSVG() {
    return `<svg class="rainy-svg" viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="30" ry="18" fill="#fff" opacity="0.8"/><ellipse cx="70" cy="60" rx="18" ry="14" fill="#e0e0e0" opacity="0.8"/><ellipse cx="35" cy="65" rx="15" ry="10" fill="#e0e0e0" opacity="0.7"/><circle class="rain-drop" cx="45" cy="80" r="4"/><circle class="rain-drop" cx="55" cy="85" r="4"/><circle class="rain-drop" cx="65" cy="80" r="4"/></svg>`;
}
function getSnowSVG() {
    return `<svg class="snowy-svg" viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="30" ry="18" fill="#fff" opacity="0.8"/><ellipse cx="70" cy="60" rx="18" ry="14" fill="#e0e0e0" opacity="0.8"/><ellipse cx="35" cy="65" rx="15" ry="10" fill="#e0e0e0" opacity="0.7"/><circle class="snow-flake" cx="50" cy="85" r="4"/><circle class="snow-flake" cx="60" cy="80" r="3"/><circle class="snow-flake" cx="40" cy="80" r="3"/></svg>`;
}
function getThunderSVG() {
    return `<svg class="thunder-svg" viewBox="0 0 100 100"><ellipse cx="50" cy="60" rx="30" ry="18" fill="#fff" opacity="0.8"/><polygon points="50,70 60,70 52,90 62,90 45,110 55,80 47,80" fill="#FFD700" stroke="#FFD700" stroke-width="2"/></svg>`;
}

// Hava durumu verilerini güncelleme fonksiyonu
function updateWeatherUI(data) {
    const weatherCode = data.current.weathercode;
    // Dinamik tema ve animasyonlu ikon
    setWeatherThemeAndIcon(weatherCode);

    tempElement.textContent = Math.round(convertTemperature(data.current.temperature_2m));
    unitElement.textContent = isCelsius ? '°C' : '°F';
    descriptionElement.textContent = getWeatherDescription(weatherCode);
    cityElement.textContent = `${data.location.name}, ${data.location.country}`;
    windElement.textContent = `${Math.round(data.current.windspeed_10m)} km/s`;
    humidityElement.textContent = `${Math.round(data.current.relativehumidity_2m)}%`;
    pressureElement.textContent = `${Math.round(data.current.pressure_msl)} hPa`;

    // Favori durumunu güncelle
    updateFavoriteButton(data.location.name);
    
    // Saatlik ve günlük tahminleri güncelle
    updateHourlyForecast(data.hourly);
    updateDailyForecast(data.daily);

    // Kart animasyonu
    const container = document.querySelector('.container');
    container.style.opacity = 0.2;
    container.style.transform = 'scale(0.97)';
    setTimeout(() => {
        container.style.transition = 'opacity 0.7s, transform 0.7s';
        container.style.opacity = 1;
        container.style.transform = 'scale(1)';
    }, 50);
}

// Saatlik tahmin güncelleme
function updateHourlyForecast(hourlyData) {
    hourlyContainer.innerHTML = '';
    const hours = hourlyData.time.slice(0, 24);
    const temps = hourlyData.temperature_2m.slice(0, 24);
    const codes = hourlyData.weathercode.slice(0, 24);

    hours.forEach((hour, index) => {
        const date = new Date(hour);
        const hourElement = document.createElement('div');
        hourElement.className = 'hourly-item';
        hourElement.innerHTML = `
            <div>${date.getHours()}:00</div>
            <i class="fas ${getWeatherIcon(codes[index])}"></i>
            <div>${Math.round(convertTemperature(temps[index]))}°</div>
        `;
        hourlyContainer.appendChild(hourElement);
    });
}

// Günlük tahmin güncelleme
function updateDailyForecast(dailyData) {
    dailyContainer.innerHTML = '';
    const days = dailyData.time.slice(0, 5);
    const temps = dailyData.temperature_2m_max.slice(0, 5);
    const codes = dailyData.weathercode.slice(0, 5);

    days.forEach((day, index) => {
        const date = new Date(day);
        const dayElement = document.createElement('div');
        dayElement.className = 'daily-item';
        dayElement.innerHTML = `
            <div>${date.toLocaleDateString('tr-TR', { weekday: 'short' })}</div>
            <i class="fas ${getWeatherIcon(codes[index])}"></i>
            <div>${Math.round(convertTemperature(temps[index]))}°</div>
        `;
        dailyContainer.appendChild(dayElement);
    });
}

// Favori butonunu güncelleme
function updateFavoriteButton(city) {
    const isFavorite = favorites.includes(city);
    favoriteButton.innerHTML = `<i class="fa${isFavorite ? 's' : 'r'} fa-heart"></i>`;
    favoriteButton.classList.toggle('active', isFavorite);
}

// Favorileri güncelleme
function updateFavorites() {
    favoritesContainer.innerHTML = '';
    favorites.forEach(city => {
        const favoriteElement = document.createElement('div');
        favoriteElement.className = 'favorite-item';
        favoriteElement.innerHTML = `
            <span>${city}</span>
            <i class="fas fa-times remove-favorite"></i>
        `;
        
        favoriteElement.querySelector('span').addEventListener('click', () => {
            getWeatherData(city);
        });
        
        favoriteElement.querySelector('.remove-favorite').addEventListener('click', (e) => {
            e.stopPropagation();
            favorites = favorites.filter(f => f !== city);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            updateFavorites();
            updateFavoriteButton(currentCity);
        });
        
        favoritesContainer.appendChild(favoriteElement);
    });
}

// Hava durumu verilerini getirme fonksiyonu
async function getWeatherData(city) {
    try {
        currentCity = city;
        // Önce şehir koordinatlarını al
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=tr&format=json`
        );
        
        if (!geoResponse.ok) {
            throw new Error('Şehir bulunamadı');
        }
        
        const geoData = await geoResponse.json();
        
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error('Şehir bulunamadı');
        }
        
        const { latitude, longitude, name, country } = geoData.results[0];
        
        // Hava durumu verilerini al
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relativehumidity_2m,pressure_msl,weathercode,windspeed_10m&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max&timezone=auto`
        );
        
        if (!weatherResponse.ok) {
            throw new Error('Hava durumu verileri alınamadı');
        }
        
        const weatherData = await weatherResponse.json();
        weatherData.location = { name, country };
        updateWeatherUI(weatherData);
    } catch (error) {
        alert(error.message);
    }
}

// Konum alma fonksiyonu
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(
                        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relativehumidity_2m,pressure_msl,weathercode,windspeed_10m&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max&timezone=auto`
                    );
                    
                    if (!response.ok) {
                        throw new Error('Hava durumu verileri alınamadı');
                    }
                    
                    const data = await response.json();
                    data.location = { name: 'Konumunuz', country: '' };
                    updateWeatherUI(data);
                } catch (error) {
                    alert(error.message);
                }
            },
            (error) => {
                alert('Konum alınamadı: ' + error.message);
            }
        );
    } else {
        alert('Tarayıcınız konum özelliğini desteklemiyor.');
    }
}

// Event listeners
searchButton.addEventListener('click', () => {
    const city = searchInput.value.trim();
    if (city) {
        getWeatherData(city);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = searchInput.value.trim();
        if (city) {
            getWeatherData(city);
        }
    }
});

locationButton.addEventListener('click', getLocation);

favoriteButton.addEventListener('click', () => {
    if (currentCity) {
        const index = favorites.indexOf(currentCity);
        if (index === -1) {
            favorites.push(currentCity);
        } else {
            favorites.splice(index, 1);
        }
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavorites();
        updateFavoriteButton(currentCity);
    }
});

celsiusButton.addEventListener('click', () => {
    if (!isCelsius) {
        isCelsius = true;
        celsiusButton.classList.add('active');
        fahrenheitButton.classList.remove('active');
        if (currentCity) {
            getWeatherData(currentCity);
        }
    }
});

fahrenheitButton.addEventListener('click', () => {
    if (isCelsius) {
        isCelsius = false;
        fahrenheitButton.classList.add('active');
        celsiusButton.classList.remove('active');
        if (currentCity) {
            getWeatherData(currentCity);
        }
    }
});

// Sayfa yüklendiğinde
window.addEventListener('load', () => {
    getWeatherData('Erzurum');
    updateFavorites();
}); 