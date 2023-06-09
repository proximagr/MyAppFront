// Populate the customer dropdown list
async function populateCustomerDropdown() {
  try {
    const response = await window.archpro.fetch("/list-users");

    const customers = response;
    //sort customers by name
    customers.sort((a, b) => a.name.localeCompare(b.name));
    const customerDropdown = document.getElementById("customer");
    customerDropdown.innerHTML = "";

    for (let customer of customers) {
      const option = document.createElement("option");
      option.value = customer.id;
      option.text = customer.name;
      customerDropdown.appendChild(option);
    }

    customerDropdown.addEventListener("change", populateProjectDropdown);
    customerDropdown.dispatchEvent(new Event("change"));
  } catch (error) {
    console.error(error);
    // Handle error accordingly
  }
}

// Populate the project dropdown list for the selected customer
async function populateProjectDropdown() {
  try {
    const customerId = document.getElementById("customer").value;
    const response = await window.archpro.fetch(
      `/list-customerprojects?customer_id=${customerId}`
    );
    const projects = response;
    //sort projects by name
    projects.sort((a, b) => a.project.localeCompare(b.project));
    const projectDropdown = document.getElementById("project");
    projectDropdown.innerHTML = "";

    for (let project of projects) {
      const option = document.createElement("option");
      option.value = project.id;
      option.text = project.project;
      projectDropdown.appendChild(option);
    }
  } catch (error) {
    console.error(error);
    // Handle error accordingly
  }
}

async function addPayment() {
  try {
    const project_Id = document.getElementById("project").value;
    const paymentAmount = document.getElementById("payment").value;
    const paymentDate = document.getElementById("date").value;
    const authToken = localStorage.getItem("authToken");
    
    const url = window.archpro.getApiPath("/addpayment");
    const body = {
      project_id: project_Id,
      payment: paymentAmount,
      date: paymentDate
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken
      },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      const data = await response.json();
      alert("Payment added!");
      console.log(data);

      const customerDropdown = document.getElementById("customer");
      customerDropdown.removeEventListener(
        "change",
        populateProjectDropdown
      );
      customerDropdown.value = "";

      const projectDropdown = document.getElementById("project");
      projectDropdown.innerHTML = "";

      populateCustomerDropdown();
    } else {
      throw new Error('Failed to add payment');
    }
  } catch (error) {
    console.error(error);
    // Handle error accordingly
  }
}

// Call the populateCustomerDropdown function to initialize the page
populateCustomerDropdown();

// Attach an event listener to the Add Payment button
const addPaymentButton = document.getElementById("addPayment");
addPaymentButton.addEventListener("click", addPayment);

//return to home page
document.addEventListener("DOMContentLoaded", function () {
  const backButton = document.querySelector("#back-btn");
  
  backButton.addEventListener("click", function () {
    window.location.href = '/';
  });
});

