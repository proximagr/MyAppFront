const customerSelect = document.getElementById("customer-select");
const addProjectForm = document.getElementById("add-project-form");

// Populate customers dropdown
/*
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
  */

// Handle form submission
addProjectForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const projectData = {
    customer_id: customerSelect.value,
    project: document.getElementById("project").value,
    price: document.getElementById("price").value,
  };

  fetch("http://arch.francecentral.cloudapp.azure.com:43704/add-project", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(projectData),
  })
    .then((response) => response.json())
    .then((data) => console.log(data)) //add logs to see what's going on
    .then((data) => {
      console.log("Success:", data);
      alert("Project added successfully!");
    })
    .then((response) => response.json()) //logs the response to the console
    .then((data) => console.log(data)) //add logs to see what's going on
    .catch((error) => {
      console.error("Error:", error);
      alert("Error adding project!");
    });
});