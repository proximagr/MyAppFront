const customerSelect = document.getElementById("customer-select");

// Populate customers dropdown
fetch("http://arch.francecentral.cloudapp.azure.com:43704/list-users")
  .then((response) => response.json())
  .then((data) => {
    console.log(data); // log the response to the console
    data.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.id;
      option.text = user.name;
      customerSelect.add(option);
    });
  })
  .then((response) => response.json()) //logs the response to the console
  .then((data) => console.log(data)) //add logs to see what's going on
  .catch((error) => console.error(error)); //logs the error to the console
  