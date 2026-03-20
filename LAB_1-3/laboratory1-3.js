"use strict";

// Універсальний фабричний метод для валідації (каррування)
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
    constructor(title) {
        this._title = title;
    }

    get title() { return this._title; }
    set title(value) { this._title = validateStr(value); }

    render() {
        const div = document.createElement("div");
        div.className = "resume-section";
        div.innerHTML = `<h2>${this.title}</h2>`;
        return div;
    }
}

// Секція: Особиста інформація
class PersonalInfo extends ResumeSection {
    constructor(name, email, age) {
        super("Особиста інформація");
        this.name = name;
        this.email = email;
        this.age = age;
    }

    get name() { return this._name; }
    set name(value) { this._name = validateStr(value); }

    get email() { return this._email; }
    set email(value) { this._email = validateStr(value); }

    get age() { return this._age; }
    set age(value) { this._age = parseAge(value); }

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
    constructor(jobTitle, company, years) {
        super("Досвід роботи");
        this.jobTitle = jobTitle;
        this.company = company;
        this.years = years;
    }

    get jobTitle() { return this._jobTitle; }
    set jobTitle(value) { this._jobTitle = validateStr(value); }

    get company() { return this._company; }
    set company(value) { this._company = validateStr(value); }

    get years() { return this._years; }
    set years(value) { this._years = validateYear(value); }

    render() {
        const div = super.render();
        div.innerHTML += `<p>${this.jobTitle} в <b>${this.company}</b> (${this.years} р.)</p>`;
        return div;
    }
}

// Секція: Освіта
class Education extends ResumeSection {
    constructor(degree, university) {
        super("Освіта");
        this.degree = degree;
        this.university = university;
    }

    get degree() { return this._degree; }
    set degree(value) { this._degree = validateStr(value); }

    get university() { return this._university; }
    set university(value) { this._university = validateStr(value); }

    render() {
        const div = super.render();
        div.innerHTML += `<p>${this.degree}, ${this.university}</p>`;
        return div;
    }
}

// Секція: Навички
class Skills extends ResumeSection {
    constructor(skillsArray) {
        super("Навички");
        this.list = skillsArray;
    }

    get list() { return this._list.join(" • "); }

    set list(array) {
        if (!Array.isArray(array) || array.length === 0) throw new Error("Список навичок порожній");
        this._list = array.map(s => s.trim()).filter(s => s.length > 0);
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

// Ініціалізація та обробка подій
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