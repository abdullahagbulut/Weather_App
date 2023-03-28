const wrapper = document.querySelector(".wrapper"),
  inputPart = wrapper.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  wIcon = wrapper.querySelector(".weather-part"),
  arrowBack = wrapper.querySelector("header i");

let api;

inputField.addEventListener("keyup", (e) => {
  //* if user pressed enter btn and input value is not empty
  if (e.key == "Enter" && inputField.value != "") {
    requestApi(inputField.value);
  }
});

const apiKey = "08fd0dcecb322c35fcd58677edade534";

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser not support geolocation api");
  }
});

function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  fetchData();
}

function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetchData();
}

function fetchData() {
  infoTxt.innerText = "Getting weather details...";
  infoTxt.classList.add("pending");
  fetch(api)
    .then((response) => response.json())
    .then((result) => weatherDetails(result))
    .catch((err) => console.error(err));
}

function weatherDetails(info) {
  if (info.cod == "404") {
    infoTxt.classList.add("error");
    infoTxt.innerText = `${inputField.value} is not a valid city name`;
    inputField.value = "";
  } else {
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { feels_like, humidity, temp } = info.main;

    if (id == 800) {
      wIcon.src = "/icons/sunny.svg";
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "/icons/stormy.svg";
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "/icons/snowy.svg";
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "/icons/foggy.svg";
    } else if (id >= 801 && id <= 804) {
      wIcon.src = "/icons/cloudy.svg";
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
      wIcon.src = "/icons/rainy.svg";
    }
    wrapper.querySelector(".temp .numb").innerText = Math.round(temp);
    wrapper.querySelector(".weather").innerText = description;
    wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
    wrapper.querySelector(".temp .numb-2").innerText = Math.round(feels_like);
    wrapper.querySelector(".humidity span").innerText = `${humidity}%`;

    infoTxt.classList.remove("pending", "error");
    wrapper.classList.add("active");
    console.log(info);
  }
}

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
  infoTxt.classList.remove("pending", "error");
  inputField.value = "";
});
