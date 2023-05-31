"use strict";

const account1 = {
  owner: "Dmitrii Fokeev",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 1111,
};

const account2 = {
  owner: "Anna Filimonova",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  pin: 2222,
};

const account3 = {
  owner: "Polina Filimonova",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  pin: 3333,
};

const account4 = {
  owner: "Stanislav Ivanchenko",
  movements: [430, 1000, 700, 50, 90],
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

function creatingLogIn(accounts) {
  accounts.forEach((val) => {
    val.logIn = val.owner
      .split(" ")
      .map((val) => val.slice(0, 1).toLocaleLowerCase())
      .join("");
  });
}

creatingLogIn(accounts);

function renderingMovements(movements) {
  containerMovements.innerHTML = "";
  movements.forEach(function (val, i) {
    const type = val > 0 ? "deposit" : "withdrawal";
    const typeDesc = val > 0 ? "зачисление" : "снятие";
    const element = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">
      ${i + 1} ${typeDesc}
    </div>
    <div class="movements__date">3 дня назад</div>
    <div class="movements__value">${val}₽</div>
  </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", element);
  });
}

function renderingCurrentBalance(account) {
  account.balance = account.movements.reduce((acc, val) => acc + val);
  let summaryValueIn = 0;
  let summaryValueOut = 0;
  account.movements.forEach((val) => {
    if (val > 0) {
      summaryValueIn += val;
    } else {
      summaryValueOut += -val;
    }
  });
  labelBalance.innerHTML = `${account.balance}₽`;
  labelSumInterest.innerHTML = `${account.balance}₽`;
  labelSumIn.innerHTML = `${summaryValueIn}₽`;
  labelSumOut.innerHTML = `${summaryValueOut}₽`;
}

function renderingUi(account) {
  renderingMovements(account.movements);
  renderingCurrentBalance(account);
}

let selectedAccount;
btnLogin.addEventListener("click", (ev) => {
  ev.preventDefault();
  const inputUsername = inputLoginUsername.value;
  const inputPIN = Number(inputLoginPin.value);
  selectedAccount = accounts.find((account) => account.logIn === inputUsername);
  if (selectedAccount && selectedAccount.pin === inputPIN) {
    containerApp.style.opacity = "100";
    inputLoginUsername.value = "";
    inputLoginPin.value = "";
    renderingUi(selectedAccount);
  } else {
    containerApp.style.opacity = "0";
  }
});

btnTransfer.addEventListener("click", (ev) => {
  ev.preventDefault();
  const accountForTransfer = accounts.find(
    (account) => account.logIn === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);
  if (
    accountForTransfer &&
    amount > 0 &&
    selectedAccount.balance >= amount &&
    accountForTransfer.logIn !== selectedAccount.logIn
  ) {
    selectedAccount.movements.push(-amount);
    accountForTransfer.movements.push(amount);
    inputTransferTo.value = inputTransferAmount.value = "";
    renderingUi(selectedAccount);
  }
});

btnClose.addEventListener("click", (ev) => {
  ev.preventDefault();
  if (
    inputCloseUsername.value == selectedAccount.logIn &&
    inputClosePin.value == selectedAccount.pin
  ) {
    const index = accounts.findIndex(
      (account) => account.logIn == selectedAccount.logIn
    );
    accounts.splice(index, 1);
    inputCloseUsername.value = inputClosePin.value = "";
    containerApp.style.opacity = "0";
    console.log(accounts);
  }
});
