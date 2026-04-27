"use strict";

// Універсальний метод для валідації (каррування)
const dataProcessor = (transformer) => (validator) => (errorMessage) => (value) => {
    const transformedValue = transformer(value);
    if (validator(transformedValue)) return transformedValue;
    throw new Error(errorMessage);
};

const parseAge = dataProcessor(Number)((n) => !isNaN(n) && n > 0 && n < 120)("Некоректний вік");
const validateStr = dataProcessor(String)((s) => s.trim().length > 0)("Поле не може бути порожнім");
const validateYear = dataProcessor(Number)((n) => !isNaN(n) && n >= 0)("Некоректна кількість років");

// Базовий клас секції
class ResumeSection {
    #title;

    constructor(title) {
        this.title = title;
    }

    get title() { return this.#title; }
    set title(value) { this.#title = validateStr(value); }

    render() {
        const div = document.createElement("div");
        div.className = "resume-section";
        div.innerHTML = `<h2>${this.title}</h2>`;
        return div;
    }
}

// Секція: Особиста інформація
class PersonalInfo extends ResumeSection {
    #name;
    #email;
    #age;

    constructor(name, email, age) {
        super("Особиста інформація");
        this.name = name;
        this.email = email;
        this.age = age;
    }

    get name() { return this.#name; }
    set name(value) { this.#name = validateStr(value); }

    get email() { return this.#email; }
    set email(value) { this.#email = validateStr(value); }

    get age() { return this.#age; }
    set age(value) { this.#age = parseAge(value); }

    render() {
        const div = super.render();
        div.innerHTML += `<p><b>Ім'я:</b> ${this.name}</p>
                          <p><b>Email:</b> ${this.email}</p>
                          <p><b>Вік:</b> ${this.age}</p>`;
        return div;
    }
}

// Секція: Досвід
class Experience extends ResumeSection {
    #jobTitle;
    #company;
    #years;

    constructor(jobTitle, company, years) {
        super("Досвід роботи");
        this.jobTitle = jobTitle;
        this.company = company;
        this.years = years;
    }

    get jobTitle() { return this.#jobTitle; }
    set jobTitle(value) { this.#jobTitle = validateStr(value); }

    get company() { return this.#company; }
    set company(value) { this.#company = validateStr(value); }

    get years() { return this.#years; }
    set years(value) { this.#years = validateYear(value); }

    render() {
        const div = super.render();
        div.innerHTML += `<p>${this.jobTitle} в <b>${this.company}</b> (${this.years} р.)</p>`;
        return div;
    }
}

// Секція: Освіта
class Education extends ResumeSection {
    #degree;
    #university;

    constructor(degree, university) {
        super("Освіта");
        this.degree = degree;
        this.university = university;
    }

    get degree() { return this.#degree; }
    set degree(value) { this.#degree = validateStr(value); }

    get university() { return this.#university; }
    set university(value) { this.#university = validateStr(value); }

    render() {
        const div = super.render();
        div.innerHTML += `<p>${this.degree}, ${this.university}</p>`;
        return div;
    }
}

// Секція: Навички
class Skills extends ResumeSection {
    #list;

    constructor(skillsArray) {
        super("Навички");
        this.list = skillsArray;
    }

    get list() { return this.#list.join(" • "); }

    set list(array) {
        if (!Array.isArray(array) || array.length === 0) throw new Error("Список навичок порожній");
        this.#list = array.map(s => s.trim()).filter(s => s.length > 0);
    }

    render() {
        const div = super.render();
        div.innerHTML += `<p>${this.list}</p>`;
        return div;
    }
}

// Управління резюме та збереження
class Resume {
    constructor() {
        this.sections = [];
    }

    addSection(section) {
        if (section instanceof ResumeSection) this.sections.push(section);
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = "";
        this.sections.forEach(section => container.appendChild(section.render()));
        localStorage.setItem("savedResume", JSON.stringify(this.sections));
    }
}

const createResumeBtn = document.getElementById("createResumeBtn");

createResumeBtn?.addEventListener("click", () => {
    try {
        const myResume = new Resume();

        myResume.addSection(new PersonalInfo(prompt("Ім'я:"), prompt("Email:"), prompt("Вік:")));
        myResume.addSection(new Experience(prompt("Посада:"), prompt("Компанія:"), prompt("Років досвіду:")));
        myResume.addSection(new Education(prompt("Ступінь:"), prompt("Університет:")));

        const skillsRaw = prompt("Навички (через кому):");
        if (!skillsRaw) throw new Error("Навички не вказані");
        myResume.addSection(new Skills(skillsRaw.split(",")));

        myResume.render("resumeOutput");
        alert("Готово!");
    } catch (e) {
        alert("Помилка: " + e.message);
    }
});