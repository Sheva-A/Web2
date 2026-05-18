"use strict";

import { greet, add, sumAll } from "./utils.js";
import { user } from "./data.js";
import { x } from "./data.js";
import { reverseNumber } from "./utils.js";

const { userName, age } = user;

console.log(greet(userName)); 
console.log(`Вік користувача: ${age}`);

const scores = [10, 20, 30];
const moreScores = [...scores, 40, 50];

console.log("Всі бали:", moreScores);
console.log("Сума балів:", sumAll(...moreScores));

document.getElementById("app").innerHTML = `
    <h2>Користувач: ${userName}</h2>
    <p>Результат додавання 5 + 5 = ${add(5, 5)}</p>
`;

console.log(reverseNumber(x));