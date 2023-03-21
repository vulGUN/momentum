import audioPlayer from './audioPlayer.js';
import todoList from './todoList.js';
import lang from './language.js';

window.onload = () => {
  setTimeout(() => {
    const preloader = document.querySelector('#preloader');
    preloader.style.display = 'none';
  }, 500);
};
document.addEventListener('DOMContentLoaded', () => {
  // вывод времени

  const time = document.querySelector('.time'),
    date = document.querySelector('.date'),
    greeting = document.querySelector('.greeting'),
    wrapper = document.querySelector('.wrapper'),
    slideNext = document.querySelector('.slide-next'),
    slidePrev = document.querySelector('.slide-prev'),
    weatherIcon = document.querySelector('.weather-icon'),
    temperature = document.querySelector('.temperature'),
    weatherDescription = document.querySelector('.weather-description'),
    wind = document.querySelector('.wind'),
    humidity = document.querySelector('.humidity'),
    city = document.querySelector('.city'),
    quote = document.querySelector('.quote'),
    quoteChangeBtn = document.querySelector('.change-quote'),
    author = document.querySelector('.author'),
    options = { weekday: 'long', month: 'long', day: 'numeric' };
  let randomNum = getRandomNum();
  let lng = localStorage.getItem('language') ?? 'ru';

  function showTime() {
    const currentTime = new Date().toLocaleTimeString();
    time.textContent = currentTime;
    showDate();
    getTimeOfDay();
    showGreeting();
    setTimeout(showTime, 1000);
  }
  showTime();

  function showDate() {
    let currentDate;
    if (lng === 'ru') {
      currentDate = new Date().toLocaleDateString('ru-RU', options);
    } else if (lng === 'en') {
      currentDate = new Date().toLocaleDateString('en-EN', options);
    }
    date.textContent = currentDate;
  }

  // приветствие

  function getTimeOfDay() {
    const hours = new Date().getHours();
    if (hours >= 0 && hours < 6) return 'night';
    else if (hours >= 6 && hours < 12) return 'morning';
    else if (hours >= 12 && hours < 18) return 'afternoon';
    else if (hours >= 18 && hours < 24) return 'evening';
  }

  console.log();

  function showGreeting() {
    const timeOfDay = getTimeOfDay();

    switch (timeOfDay) {
      case 'night':
        greeting.textContent = `${lang[lng].greeting.night}`;
        break;
      case 'morning':
        greeting.textContent = `${lang[lng].greeting.morning}`;
        break;
      case 'afternoon':
        greeting.textContent = `${lang[lng].greeting.afternoon}`;
        break;
      case 'evening':
        greeting.textContent = `${lang[lng].greeting.evening}`;
        break;
      default:
        greeting.textContent = `${lang[lng].greeting.default}`;
    }
  }

  // добавление / сохраниние имени пользователя и погоды в local storage

  const userName = document.querySelector('.name');

  function setLocalStorage() {
    localStorage.setItem('userName', userName.value);
    localStorage.setItem('cityName', city.value);
    localStorage.setItem('language', lng);
  }
  window.addEventListener('beforeunload', setLocalStorage);

  function getLocalStorage() {
    if (localStorage.getItem('language')) {
      lng = localStorage.getItem('language');
    }
    if (localStorage.getItem('userName')) {
      userName.value = localStorage.getItem('userName');
    }
    if (localStorage.getItem('cityName')) {
      city.value = localStorage.getItem('cityName');
    } else {
      localStorage.setItem('cityName', 'Минск');
      city.value = localStorage.getItem('cityName');
    }
  }
  window.addEventListener('load', getLocalStorage);

  // Выбор фоновой картинки

  let bgImg = 0;

  function setBg(link) {
    const bgNum = randomNum.toString().padStart(2, '0'),
      timeOfDay = getTimeOfDay();
    const img = new Image();
    if (bgImg === 0) {
      img.src = `https://github.com/vulGUN/images_for_momentum_task/blob/assets/images/${timeOfDay}/${bgNum}.jpg?raw=true`;
    } else if (bgImg === 1) {
      img.src = getLinkToImage();
      console.log(img.src);
    }
    // img.src = link;
    img.onload = () => {
      wrapper.style.backgroundImage = `url(${img.src})`;
    };
  }

  setBg();

  // слайдер

  function getRandomNum() {
    return Math.ceil(Math.random() * 20);
  }

  function getSlideNext() {
    randomNum > 0 && randomNum < 20 ? randomNum++ : (randomNum = 1);
    setBg();
    getLinkToImage();
  }

  function getSlidePrev() {
    randomNum > 1 && randomNum <= 20 ? randomNum-- : (randomNum = 20);
    setBg();
    getLinkToImage();
  }

  slideNext.addEventListener('click', getSlideNext);
  slidePrev.addEventListener('click', getSlidePrev);

  // настройка погоды
  city.addEventListener('change', getWeather);
  window.addEventListener('load', getWeather);

  async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${lng}&appid=08f2a575dda978b9c539199e54df03b0&units=metric`;
    const res = await fetch(url);
    const data = await res.json();
    const weatherError = document.querySelector('.weather-error'),
      weatherWrap = document.querySelector('.weather-wrap');

    if (res.status != 200) {
      weatherError.style.display = 'block';
      weatherError.innerText = `${lang[lng].weatherError}`;
      weatherWrap.style.display = 'none';
    } else {
      weatherWrap.style.display = 'flex';
      weatherError.style.display = 'none';
      weatherError.innerText = '';
      city.placeholder = `${lang[lng].city}`;
      weatherIcon.className = 'weather-icon owf';
      weatherIcon.classList.add(`owf-${data.weather[0].id}`);
      temperature.textContent = `${Math.round(data.main.temp)} °C,`;
      weatherDescription.textContent = data.weather[0].description;
      wind.textContent = `${lang[lng].windSpeed}: ${Math.round(data.wind.speed)} м/с`;
      humidity.textContent = `${lang[lng].humidity}: ${data.main.humidity}%`;
    }

    if (city.value) city.value = `${data.name}`;
    else city.value = ``;

    setTimeout(getWeather, 600000);
  }

  // добавление цитат

  async function getQuotes() {
    const num = getRandomNum(),
      quotes = './js/data.json',
      res = await fetch(quotes),
      data = await res.json();

    addAnimationQuotes();
    setTimeout(() => {
      quote.textContent = `${data[lng][num - 1].text}`;
      author.textContent = `${data[lng][num - 1].author}`;
    }, 500);
  }
  getQuotes();

  function addAnimationQuotes() {
    quote.classList.add('animation-smoothOpacity');
    quoteChangeBtn.classList.add('rotate-quote');
    author.classList.add('animation-smoothOpacity');
    setTimeout(removeAnimationQuotes, 1000);
  }

  function removeAnimationQuotes() {
    quoteChangeBtn.classList.remove('rotate-quote');
    quote.classList.remove('animation-smoothOpacity');
    author.classList.remove('animation-smoothOpacity');
  }

  quoteChangeBtn.addEventListener('click', getQuotes);

  // добавление аудиоплеера

  audioPlayer();
  todoList();

  // настройки и todo list

  const settingsBtn = document.querySelector('.settings-btn'),
    settingsMenu = document.querySelector('.settings-menu');

  settingsBtn.addEventListener('click', () => {
    settingsMenu.classList.toggle('active-menu');
  });

  // Смена языка

  const ruLangBtn = document.querySelector('.ru-lang'),
    enLangBtn = document.querySelector('.en-lang'),
    langLabel = document.querySelector('.lang-label'),
    todoInput = document.querySelector('.todo-input'),
    todoPlaceholder = document.querySelector('.todo-placeholder');

  function changeLangLabel() {
    langLabel.innerText = `${lang[lng].language}:`;
  }
  changeLangLabel();

  function changeTaskLang() {
    todoInput.placeholder = `${lang[lng].todoList.newTask}`;
    todoPlaceholder.innerText = `${lang[lng].todoList.noTasks}`;
  }

  changeTaskLang();

  function checkLangBtn() {
    if (lng === 'ru') {
      ruLangBtn.classList.add('lang-btn-active');
      enLangBtn.classList.remove('lang-btn-active');
    } else if (lng === 'en') {
      enLangBtn.classList.add('lang-btn-active');
      ruLangBtn.classList.remove('lang-btn-active');
    }
  }

  checkLangBtn();

  ruLangBtn.addEventListener('click', () => {
    if (!ruLangBtn.classList.contains('settings-btn-active')) {
      ruLangBtn.classList.add('settings-btn-active');
      enLangBtn.classList.remove('settings-btn-active');
      lng = 'ru';
      showGreeting();
      getQuotes();
      showDate();
      getWeather();
      changeLangLabel();
      changeTaskLang();
    }
  });
  enLangBtn.addEventListener('click', () => {
    if (!enLangBtn.classList.contains('settings-btn-active')) {
      enLangBtn.classList.add('settings-btn-active');
      ruLangBtn.classList.remove('settings-btn-active');
      lng = 'en';
      showGreeting();
      getQuotes();
      showDate();
      getWeather();
      changeLangLabel();
      changeTaskLang();
    }
  });

  // подключение unsplash по api

  const unspBtn = document.querySelector('.unsplash-photos');

  async function getLinkToImage() {
    const url = 'https://api.unsplash.com/photos/random?orientation=landscape&query=nature&client_id=0Y7IURV-wgDimz5harrc4UEGd4JnPPZ4oJHaJLGqIRU';
    const res = await fetch(url);
    const unsp = await res.json();
    // wrapper.style.backgroundImage = `url(${unsp.urls.regular})`;
    bgImg = 1;
    return unsp.urls.regular;
  }

  unspBtn.addEventListener('click', () => {
    getLinkToImage();
    setBg();
  });

  // getLinkToImage();
});
