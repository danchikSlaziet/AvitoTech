const firstPage = document.querySelector(".first-page");
const secondPage = document.querySelector(".second-page");
const mainBarItemsArray = document.querySelectorAll(".main__bar-item");
const checkboxesArray = document.querySelectorAll(".news__item-checkbox");
const newsBlock = document.querySelector(".news");
const vacanciesBlock = document.querySelector(".vacancies");
const sendButton = document.querySelector(".main__send-button");
const overlay = document.querySelector(".overlay");
const timeButton = document.querySelector(".navbar__time");
const overlayCheckboxes = overlay.querySelectorAll(".overlay__checkbox");
const overlayButton = overlay.querySelector(".overlay__button");
const overlayCloseButton = overlay.querySelector(".overlay-close");
const finalPage = document.querySelector(".final-page");
const finalPageExitButton = finalPage.querySelector('.final-page__button_exit');
const finalPageTimeButton = finalPage.querySelector('.final-page__button_time');
const vacanciesArray = document.querySelectorAll(".vacancies__link");
const vacanciesButton = document.querySelector(".vacancies__send-btn");
// отмена закрытия по свайпу (если скролла нет, то работает отлично, когда скролл есть - закрывается при проведении буквой Г, например слева направо и вниз)
const overflow = 100;
document.body.style.overflowY = 'hidden';
document.body.style.marginTop = `${overflow}px`;
document.body.style.height = window.innerHeight + overflow + "px";
document.body.style.paddingBottom = `${overflow}px`;
window.scrollTo(0, overflow);
// отмена закрытия по свайпу
function parseQuery(queryString) {
  let query = {};
  let pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  for (let i = 0; i < pairs.length; i++) {
      let pair = pairs[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}



class Api {
  constructor({baseUrl}) {
    this._baseUrl = baseUrl;
  }

  _getFetch(url, options) {
    return fetch(url, options)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        return Promise.reject(`Ошибка ${res.status}`)
      });
  }

  getUser(id) {
    const url = this._baseUrl + 'get_user/' + `${id}/`;
    const options = {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
    }
    return this._getFetch(url, options);
  }

  postUser(id, data) {
    const url = this._baseUrl + 'update_user/' + `${id}/`;
    const options = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    }
    return this._getFetch(url, options);
  }
}

const api = new Api({
  baseUrl: 'https://avitotg.grimdev.ru/api/',
});





let userChatId;
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    firstPage.classList.remove('first-page_active');
    secondPage.classList.add('second-page_active');
  }, 2500)
  let app = window.Telegram.WebApp;
  let query = app.initData;
  let user_data_str = parseQuery(query).user;
  let user_data = JSON.parse(user_data_str);
  app.expand();
  app.ready();
  userChatId = user_data["id"];
  api.getUser(userChatId)
    .then((data) => {
      console.log(data)
      if (data['time']) {
        overlayCheckboxes.forEach(checkbox => {
          checkbox.classList.remove('overlay__checkbox_active');
        });
        overlayCheckboxes.forEach(checkbox => {
          if (data["time"] == checkbox.innerText.trim()) {
            checkbox.classList.add('overlay__checkbox_active');
          }
        });
      }
      if (data['career']) {

      }
      if (data['content']) {

      }
    })
    .catch(err => console.log(err));
});

function vibro() {
  let detect = new MobileDetect(window.navigator.userAgent);
  if (detect.os() === 'iOS') {
    window.Telegram.WebApp.HapticFeedback.impactOccurred("light");
  }
  else {
    if ("vibrate" in navigator) {
      // Вибрируем устройство в течение 1000 миллисекунд (1 секунда)
      navigator.vibrate(10);
    } else {
      // Ваш браузер не поддерживает API вибрации
      console.log("Ваш браузер не поддерживает API вибрации.");
    }
  }
}


timeButton.addEventListener('click', () => {
  overlay.classList.add('overlay_active');
});

mainBarItemsArray.forEach((elem, index) => {
  elem.addEventListener('click', () => {
    if (index === 0) {
      mainBarItemsArray[index].classList.add("main__bar-item_active");
      mainBarItemsArray[index + 1].classList.remove("main__bar-item_active");
      vacanciesBlock.classList.add("vacancies_disabled");
      newsBlock.classList.remove('news_disabled');
    }
    else if (index === 1) {
      mainBarItemsArray[index].classList.add("main__bar-item_active");
      mainBarItemsArray[index - 1].classList.remove("main__bar-item_active");
      vacanciesBlock.classList.remove("vacancies_disabled");
      newsBlock.classList.add('news_disabled');
    }
  })
});
checkboxesArray.forEach((elem) => {
  elem.addEventListener("click", () => {
    vibro();
    if (elem.className.includes("active")) {
      let activeCheckboxes = 0;
      elem.classList.remove("news__item-checkbox_active");
      checkboxesArray.forEach((checkbox) => {
        if (checkbox.className.includes('active')) {
          activeCheckboxes += 1;
        }
      });
      if (activeCheckboxes === 0) {
      }
    }
    else {
      elem.classList.add("news__item-checkbox_active");
    }
  });
});
vacanciesArray.forEach((elem) => {
  elem.addEventListener("click", () => {
    vibro();
    if (elem.className.includes("active")) {
      let activeVacanciesCheckboxes = 0;
      elem.classList.remove("vacancies__link_active");
      checkboxesArray.forEach((checkbox) => {
        if (checkbox.className.includes('active')) {
          activeVacanciesCheckboxes += 1;
        }
      });
      if (activeVacanciesCheckboxes === 0) {
      }
    }
    else {
      elem.classList.add("vacancies__link_active");
    }
  });
});
overlayCheckboxes.forEach((elem) => {
  elem.addEventListener('click', () => {
    vibro();
    overlayCheckboxes.forEach((checkbox) => {
      checkbox.classList.remove("overlay__checkbox_active");
    });
    elem.classList.add('overlay__checkbox_active');
  });
});
overlayCloseButton.addEventListener('click', () => {
  overlay.classList.remove('overlay_active');
});
overlay.addEventListener("click", (evt) => {
  if (evt.currentTarget === evt.target) {
    overlay.classList.remove('overlay_active');
  }
});
sendButton.addEventListener("click", () => {
  finalPage.classList.add("final-page_active");
});
vacanciesButton.addEventListener("click", () => {
  finalPage.classList.add("final-page_active");
});
finalPageExitButton.addEventListener('click', () => {
  finalPage.classList.remove('final-page_active');
});
finalPageTimeButton.addEventListener('click', () => {
  finalPage.classList.remove('final-page_active');
  setTimeout(() => {
    overlay.classList.add("overlay_active");
  }, 200)
});


let infoObject = {
  time: '',
  career: [],
  content: [],
};
overlayButton.addEventListener('click', () => {
  checkboxesArray.forEach(checkbox => {
    if (checkbox.className.includes('active')) {
      infoObject.content.push(checkbox.innerText.trim());
    }
  });
  overlayCheckboxes.forEach(checkbox => {
    if (checkbox.className.includes('active')) {
      infoObject.time = checkbox.innerText.trim();
    }
  });
  vacanciesArray.forEach(vacancies => {
    if (vacancies.className.includes('active')) {
      infoObject.career.push(vacancies.innerText.trim())
    }
  });
  api.postUser(userChatId, infoObject)
    .then(data => console.log(data))
    .catch(err => console.log(err));
  console.log(infoObject)
  infoObject = {
    time: '',
    career: [],
    content: []
  }
  overlay.classList.remove("overlay_active");
});