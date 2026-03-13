"use strict";

alert("Вітаю! Заповніть анкету.");

let userName = prompt("Введіть ваше ім'я:");
let userAge = Number(prompt("Введіть ваш вік:"));
let userCity = prompt("Введіть ваше місто:");
let favoriteColor = prompt("Ваш улюблений колір:");
let isWorking = confirm("Ви працюєте?");

let isAdult = userAge >= 18;

console.log("Типи даних");
console.log("userName:", typeof userName);
console.log("userAge:", typeof userAge);
console.log("userCity:", typeof userCity);
console.log("favoriteColor:", typeof favoriteColor);
console.log("isWorking:", typeof isWorking); 

console.log("Перетворення");
console.log("Вік як рядок:", String(userAge));
console.log("Вік як булеве значення:", Boolean(userAge));

let message = `
Ім'я: ${userName}
Вік: ${userAge}
Місто: ${userCity}
Колір: ${favoriteColor}
Працює: ${isWorking ? "Так" : "Ні"}
Повнолітній: ${isAdult ? "Так" : "Ні"}
`;

alert(message);

console.log("Результат анкетування:");
console.log(message);