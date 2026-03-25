"use strict";

// АНКЕТА
function runApp1() {
  const myData = createSurvey();
  displaySurvey(myData);
}

function createSurvey() {
  const name = prompt("Введіть ваше ім'я:");
  const ageInput = prompt("Введіть ваш вік:");
  const city = prompt("Введіть ваше місто:");

  const age = Number(ageInput);
  const isAdult = age >= 18;

  return {
    name: name,
    age: age,
    city: city,
    isAdult: isAdult
  };
}

function displaySurvey(surveyData) {
  const message = `Користувач: ${surveyData.name}
  Вік: ${surveyData.age}
  Місто: ${surveyData.city}
  Повнолітній: ${surveyData.isAdult ? "Так" : "Ні"}`;

  console.log("Результати анкети:");
  console.table(surveyData);
  alert(message);
}

// КОНВЕРТАТОР ТЕМПЕРАТУРИ

function runApp2() {
  function createConverter(multiplier, offset) {
    return function(temp) {
      return (temp * multiplier) + offset;
    };
  }

  const celsiusToFahrenheit = createConverter(1.8, 32);
  const fahrenheitToCelsius = createConverter(5/9, -(32 * 5/9));

  const tempInput = parseFloat(prompt("Введіть числове значення температури:"));
  const direction = prompt("Виберіть напрямок конвертації: 'C to F' або 'F to C'");

  let result;
  let message;

  if (direction === "C to F") {
    result = celsiusToFahrenheit(tempInput);
    message = `${tempInput}°C дорівнює ${result.toFixed(2)}°F`;
  } else if (direction === "F to C") {
    result = fahrenheitToCelsius(tempInput);
    message = `${tempInput}°F дорівнює ${result.toFixed(2)}°C`;
  } else {
    message = "Помилка: Невірно вказаний напрямок.";
  }

  displayTemp(result, message);
}

function displayTemp(result, message) {
  if (result !== undefined) {
    alert(message);
    console.log(message);
  } else {
    alert(message);
  }
}
