"use strict";

// Валідація (каррування та замикання)
const createValidator = (errorMessage) => (validatorFn) => (value) => {
    if (validatorFn(value)) return value;
    throw new Error(errorMessage);
};

const isNotEmpty = createValidator("Поле не може бути порожнім")((v) => v && v.trim().length > 0);
const isPositiveNum = createValidator("Введіть коректне число")((v) => !isNaN(parseFloat(v)) && v > 0);

// Клас: Секція (інші класи його наслідують)
class ResumeSection {
    constructor(title) {
        this.title = isNotEmpty(title);
    }

    createBaseElement() {
        const div = document.createElement("div");
        div.className = "resume-section";
        div.innerHTML = `<h3>${this.title}</h3>`;
        return div;
    }
}

// Клас: Особиста інформація
class PersonalInfo extends ResumeSection {
    #age;

    constructor(name, email, age) {
        super("Особиста інформація");
        this.name = isNotEmpty(name);
        this.email = isNotEmpty(email);
        this.age = age; 
    }

    get age() { return this.#age; }
    set age(value) { 
        this.#age = Number(isPositiveNum(value)); 
    }

    render() {
        const div = this.createBaseElement();
        div.innerHTML += `
            <p><b>Ім'я:</b> ${this.name}</p>
            <p><b>Email:</b> ${this.email}</p>
            <p><b>Вік:</b> ${this.age}</p>`;
        return div;
    }
}

// Клас: Досвід роботи
class Experience extends ResumeSection {
    constructor(company, role, years) {
        super("Досвід роботи");
        this.company = isNotEmpty(company);
        this.role = isNotEmpty(role);
        this.years = isPositiveNum(years);
    }

    render() {
        const div = this.createBaseElement();
        div.innerHTML += `<p>${this.role} в <b>${this.company}</b> (${this.years} р.)</p>`;
        return div;
    }
}

// Клас: Навички
class Skills extends ResumeSection {
    constructor(skillsString) {
        super("Навички");
        this.list = isNotEmpty(skillsString).split(",").map(s => s.trim());
    }

    render() {
        const div = this.createBaseElement();
        div.innerHTML += `<p>${this.list.join(" • ")}</p>`;
        return div;
    }
}

// Головний клас (збір всіх розділів)
class Resume {
    constructor() {
        this.sections = [];
    }

    addSection(section) {
        this.sections.push(section);
    }

    render(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = ""; 
        this.sections.forEach(section => container.appendChild(section.render()));

        // Збереження в localStorage
        localStorage.setItem("myResume", JSON.stringify(this.sections));
    }
}

// Введення даних користувачем
document.getElementById("createResumeBtn")?.addEventListener("click", () => {
    try {
        const myResume = new Resume();

        const name = prompt("Ваше ім'я:");
        const email = prompt("Ваш Email:");
        const age = prompt("Ваш вік:");
        myResume.addSection(new PersonalInfo(name, email, age));

        const company = prompt("Компанія:");
        const role = prompt("Посада:");
        const years = prompt("Скільки років досвіду:");
        myResume.addSection(new Experience(company, role, years));

        const skills = prompt("Навички (через кому):");
        myResume.addSection(new Skills(skills));

        myResume.render("resumeOutput");
        alert("Резюме успішно створено!");

    } catch (error) {
        alert("Помилка: " + error.message);
    }
});