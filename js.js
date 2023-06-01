"use strict";

const account1 = {
  owner: "Dmitrii Fokeev",
  movements: [
    [200, "2019-11-18T21:31:17.178Z"],
    [450, "2019-12-23T07:42:02.383Z"],
    [-400, "2020-01-28T09:15:04.904Z"],
    [3000, "2020-04-01T10:17:24.185Z"],
    [-650, "2020-05-08T14:11:59.604Z"],
    [-130, "2020-05-27T17:01:17.194Z"],
    [70, "2020-07-11T23:36:17.929Z"],
    [1300, "2020-07-12T10:51:36.790Z"],
  ],
  pin: 1111,
};

const account2 = {
  owner: "Anna Filimonova",
  movements: [
    [5000, "2019-11-01T13:15:33.035Z"],
    [3400, "2019-11-30T09:48:16.867Z"],
    [-150, "2019-12-25T06:04:23.907Z"],
    [-790, "2020-01-25T14:18:46.235Z"],
    [-3210, "2020-02-05T16:33:06.386Z"],
    [-1000, "2020-04-10T14:43:26.374Z"],
    [8500, "2020-06-25T18:49:59.371Z"],
    [-30, "2020-07-26T12:01:20.894Z"],
  ],
  pin: 2222,
};

const account3 = {
  owner: "Polina Filimonova",
  movements: [
    [200, "2019-11-01T13:15:33.035Z"],
    [-200, "2019-11-30T09:48:16.867Z"],
    [340, "2019-12-25T06:04:23.907Z"],
    [-300, "2020-01-25T14:18:46.235Z"],
    [-20, "2020-02-05T16:33:06.386Z"],
    [50, "2020-04-10T14:43:26.374Z"],
    [400, "2020-06-25T18:49:59.371Z"],
    [-460, "2020-07-26T12:01:20.894Z"],
  ],
  pin: 3333,
};

const account4 = {
  owner: "Stanislav Ivanchenko",
  movements: [
    [430, "2019-11-01T13:15:33.035Z"],
    [1000, "2019-11-30T09:48:16.867Z"],
    [700, "2019-12-25T06:04:23.907Z"],
    [50, "2020-01-25T14:18:46.235Z"],
    [90, "2020-02-05T16:33:06.386Z"],
  ],
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

function getDateInFormat(date) {
  let tempDate;
  if (date) {
    tempDate = new Date(date);
  } else {
    tempDate = new Date();
  }

  const yearNow = tempDate.getFullYear();
  const monthNow = `${tempDate.getMonth() + 1}`.padStart(2, 0);
  const dayNow = `${tempDate.getDate()}`.padStart(2, 0);
  const hoursNow = `${tempDate.getHours()}`.padStart(2, 0);
  const minutesNow = `${tempDate.getMinutes()}`.padStart(2, 0);
  const secondsNow = `${tempDate.getSeconds()}`.padStart(2, 0);
  return `${dayNow}/${monthNow}/${yearNow} ${hoursNow}:${minutesNow}:${secondsNow}`;
}

function creatingLogIn(accounts) {
  accounts.forEach((val) => {
    val.logIn = val.owner
      .split(" ")
      .map((val) => val.slice(0, 1).toLocaleLowerCase())
      .join("");
  });
}

creatingLogIn(accounts);

function renderingMovements(movements, isSorted = false) {
  containerMovements.innerHTML = "";
  const movs = isSorted
    ? movements.slice().sort((a, b) => a[0] - b[0])
    : movements;
  movs.forEach(function (val, i) {
    const type = val[0] > 0 ? "deposit" : "withdrawal";
    const typeDesc = val[0] > 0 ? "зачисление" : "снятие";
    const element = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">
      ${i + 1} ${typeDesc}
    </div>
    <div class="movements__date">${getDateInFormat(val[1])}</div>
    <div class="movements__value">${val[0]}₽</div>
  </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", element);
  });
}

function renderingCurrentBalance(account) {
  account.balance = account.movements.reduce((acc, val) => acc + val[0], 0);
  let summaryValueIn = 0;
  let summaryValueOut = 0;
  account.movements.forEach((val) => {
    if (val[0] > 0) {
      summaryValueIn += val[0];
    } else {
      summaryValueOut += -val[0];
    }
  });
  labelBalance.innerHTML = `${account.balance}₽`;
  labelSumInterest.innerHTML = `${account.balance}₽`;
  labelSumIn.innerHTML = `${summaryValueIn}₽`;
  labelSumOut.innerHTML = `${summaryValueOut}₽`;
  labelDate.textContent = getDateInFormat();
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
    selectedAccount.movements.push([-amount, new Date().toISOString()]);
    accountForTransfer.movements.push([amount, new Date().toISOString()]);
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
  }
});

btnLoan.addEventListener("click", (ev) => {
  ev.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  if (loanAmount > 0) {
    selectedAccount.movements.push([loanAmount, new Date().toISOString()]);
    inputLoanAmount.value = "";
    renderingUi(selectedAccount);
  }
});

let sorted = false;
btnSort.addEventListener("click", (ev) => {
  ev.preventDefault();
  renderingMovements(selectedAccount.movements, !sorted);
  sorted = !sorted;
});

labelBalance.addEventListener("click", () => {
  Array.from(document.querySelectorAll(".movements__value"), (val) => {
    return (val.innerText = val.textContent.replace("₽", "RUB"));
  });
});
