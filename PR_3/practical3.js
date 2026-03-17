// БІБЛІОТЕКА КОРИСТУВАЧІВ
function runApp1() {
    class User {
        constructor(name, age, profession) {
            this.name = name;
            this.age = age;
            this.profession = profession;
        }

        display() {
            return `Ім'я: ${this.name}, Вік: ${this.age}, Професія: ${this.profession}`;
        }
    }

    class Admin extends User {
        constructor(name, age, profession, role) {
            super(name, age, profession);
            this.role = role;
        }

        display() {
            return super.display() + `, Роль: ${this.role} (Адміністратор)`;
        }
    }

    const name = prompt("Введіть ім'я:");
    const ageInput = prompt("Введіть вік:");
    const age = parseInt(ageInput);
    const prof = prompt("Введіть професію:");

    if (isNaN(age) || age <= 0) {
        alert("Помилка: вік повинен бути числом більше 0!");
        return;
    }

    const isAdmin = confirm("Зробити цього користувача адміністратором?");
    let person;

    if (isAdmin) {
        const role = prompt("Введіть роль (напр. Moderator, Superuser):");
        person = new Admin(name, age, prof, role);
    } else {
        person = new User(name, age, prof);
    }

    const info = person.display();
    alert(info);
    console.log(info);
}

// ВЛАСНИЙ ПРОЄКТ ООП
function runApp2() {
    class BankAccount {
        #balance = 0;

        constructor(owner) {
            this.owner = owner;
        }

        deposit(amount) {
            if (amount > 0) {
                this.#balance += amount;
                return true;
            }
            return false;
        }

        getBalance() {
            return this.#balance;
        }
    }

    class SavingsAccount extends BankAccount {
        constructor(owner, interestRate) {
            super(owner);
            this.interestRate = interestRate;
        }

        showInfo() {
            return `Власник: ${this.owner}, Баланс: ${this.getBalance()}грн, Ставка: ${this.interestRate}%`;
        }
    }

    const ownerName = prompt("Введіть ім'я власника рахунку:");
    const myAcc = new SavingsAccount(ownerName, 5);
    
    const depositAmount = parseFloat(prompt("Скільки грошей внести на рахунок?"));
    
    if (myAcc.deposit(depositAmount)) {
        const result = myAcc.showInfo();
        alert("Рахунок створено успішно!\n" + result);
        console.log("Об'єкт аккаунту:", myAcc);
    } else {
        alert("Некоректна сума депозиту.");
    }
}
