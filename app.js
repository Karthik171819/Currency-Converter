const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Base URL of API (without any query params)
const BASE_URL = "https://open.er-api.com/v6/latest";

// Populate dropdowns with currency codes from countryList
for (const select of dropdowns) {
  for (const currCode in countryList) {
    const option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;

    if (select.name === "from" && currCode === "USD") option.selected = true;
    if (select.name === "to" && currCode === "INR") option.selected = true;

    select.appendChild(option);
  }

  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });
}

// Update flag image next to dropdown based on selected currency
function updateFlag(selectElement) {
  const currCode = selectElement.value;
  const countryCode = countryList[currCode];
  const img = selectElement.parentElement.querySelector("img");

  if (img && countryCode) {
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
  }
}

// Fetch exchange rate and update UI
async function updateExchangeRate() {
  const amountInput = document.querySelector(".amount input");
  let amtVal = parseFloat(amountInput.value);

  if (isNaN(amtVal) || amtVal <= 0) {
    amtVal = 1;
    amountInput.value = "1";
  }

  const from = fromCurr.value;
  const to = toCurr.value;

  // Build API URL to fetch rates relative to the FROM currency
  const url = `${BASE_URL}/${from}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.result === "success") {
      const rates = data.rates;

      if (!rates[to]) {
        msg.innerText = `Exchange rate for ${to} not found.`;
        return;
      }

      const rate = rates[to];
      const convertedAmount = amtVal * rate;

      msg.innerText = `${amtVal} ${from} = ${convertedAmount.toFixed(2)} ${to}`;
    } else {
      msg.innerText = "Failed to retrieve exchange rates.";
    }
  } catch (error) {
    msg.innerText = "Failed to fetch exchange rate. Please check your internet connection.";
    console.error("Error fetching exchange rate:", error);
  }
}

// Button click event listener
btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

// On page load, update flags and exchange rate
window.addEventListener("load", () => {
  for (const select of dropdowns) {
    updateFlag(select);
  }
  updateExchangeRate();
});
