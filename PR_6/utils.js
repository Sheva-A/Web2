"use strict";

export function greet(name) {
    return `Привіт, ${name}!`; 
}

export const add = (a, b) => a + b; 

export function sumAll(...nums) { 
    return nums.reduce((acc, num) => acc + num, 0);
}

export function reverseNumber(num){
    return num*(-1);
}