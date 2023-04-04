document.addEventListener("DOMContentLoaded", function () {
    const customerSelect = document.querySelector("#customer-select");
    const addProjectForm = document.querySelector("#add-project-form");
  
    // Populate customer select options
    fetch("http://arch.francecentral.cloudapp.azure.com:43704/list-users")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((user) => {
          const option = document.createElement("customer-select");
          option.value = user.id;
          option.text = user.name;
          customerSelect.add(customer-select);
        });
      })
      .catch((error) => console.error(error));
  
    // Handle form submit
    addProjectForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      const formData = new FormData(addProjectForm);
      const project = formData.get("project");
      const price = formData.get("price");
      const customer_id = formData.get("customer");
  
      fetch("http://arch.francecentral.cloudapp.azure.com:43704/add-project", {
        method: "POST",
        body: JSON.stringify({ project, price, customer_id }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Project added:", data);
          addProjectForm.reset();
        })
        .catch((error) => console.error(error));
    });
  });
  