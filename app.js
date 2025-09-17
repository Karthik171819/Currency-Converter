const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.min.json";

const dropdownSelect = document.querySelectorAll(".dropdown select");

fetch(BASE_URL)
  .then(response => response.json())
  .then(countryList => {
    // countryList is now defined

    for (let select of dropdownSelect) {
      for (let currCode in countryList) {
        const newOption = document.createElement("option");
        newOption.innerText = currCode.toUpperCase();  // Optional: uppercase display
        newOption.value = currCode;
        if(select.name === "from" && currCode === "USD"){
            newOption.selected = "selected";
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected";
        }
        select.append(newOption);
      }
    }
  })
  .catch(error => {
    console.error("Failed to load currency data:", error);
  });