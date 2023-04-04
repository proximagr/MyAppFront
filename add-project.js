document.addEventListener("DOMContentLoaded", function () {
    const addProjectForm = document.querySelector("#add-project-form");
  
    addProjectForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      const customer_id = document.querySelector("#customer-select").value;
      const project = document.querySelector("#project-name").value;
      const price = document.querySelector("#project-price").value;
  
      const data = {
        customer_id: customer_id,
        project: project,
        price: price
      };
  
      fetch("http://arch.francecentral.cloudapp.azure.com:43704/add-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        alert("Project added successfully!");
      })
        .catch(error => {
          console.error(error);
          alert("Failed to add project. See console for details.");
        });
    });
    });