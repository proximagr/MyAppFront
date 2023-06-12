// Populate the customer dropdown list
async function populateCustomerDropdown() {
  try {
    const response = await window.archpro.fetch("/list-users");

    const customers = response; // Use the response directly

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

    const projectDropdown = document.getElementById("project");
    projectDropdown.innerHTML = "";

    for (let project of projects) {
      const option = document.createElement("option");
      option.value = project.project_id;
      option.text = project.project_name;
      projectDropdown.appendChild(option);
    }
  } catch (error) {
    console.error(error);
    // Handle error accordingly
  }
}

// Add a payment to the database
async function addPayment() {
  try {
    const projectId = document.getElementById("project").value;
    const paymentAmount = document.getElementById("payment").value;
    const paymentDate = document.getElementById("date").value;

    const response = await window.archpro.fetch("/addpayment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_id: projectId,
        payment: paymentAmount,
        date: paymentDate,
      }),
    });

    const data = response;
    alert("Payment added!");
    console.log(data);

    // Clear fields and repopulate customer dropdown
    document.getElementById("payment").value = "";
    document.getElementById("date").value = "";

    populateCustomerDropdown();
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
