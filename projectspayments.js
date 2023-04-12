const customerSelect = document.getElementById("customer-select");
const projectSelect = document.getElementById("project-select");
const paymentTotal = document.getElementById("payment-total")
const projectPriceEl = document.getElementById("project-price")
const paymentTable = document.getElementById("payment-table");
const paymentTableHeader = paymentTable.createTHead();

// Populate the customer dropdown
fetch("http://arch.francecentral.cloudapp.azure.com:43704/list-users")
	.then(response => response.json())
	.then(customers => {
		for (let customer of customers) {
			const option = document.createElement("option");
			option.value = customer.id;
			option.textContent = customer.name;
			customerSelect.appendChild(option);
		}
	})
	.catch(error => console.error(error));

// Clear project and payment tables and populate the project dropdown when a customer is selected
customerSelect.addEventListener("change", event => {
	const customerId = event.target.value;
	projectSelect.innerHTML = "<option value=''>Select a project</option>";
	paymentTable.innerHTML = "";
	if (customerId) {
		fetch(`http://arch.francecentral.cloudapp.azure.com:43704/list-customerprojects?customer_id=${customerId}`)
			.then(response => response.json())
			.then(projects => {
				for (let project of projects) {
					const option = document.createElement("option");
					option.value = project.id;
					option.textContent = project.project + " ($" + project.price + ")";
					projectSelect.appendChild(option);
				}
			})
			.catch(error => console.error(error));
	}
});

// Populate the payment table and project price when a project is selected
projectSelect.addEventListener("change", event => {
  const projectId = event.target.value;
  paymentTable.innerHTML = "";
  paymentTotal.textContent = "";
  if (projectId) {
    fetch(`http://arch.francecentral.cloudapp.azure.com:43704/list-projectspayments?project_id=${projectId}`)
      .then(response => response.json())
      .then(payments => {
        let totalPayment = payments.reduce((sum, payment) => sum + payment.payment, 0);
        // Create table headers
        const headerRow = paymentTable.insertRow();
        const dateHeader = headerRow.insertCell();
        const amountHeader = headerRow.insertCell();
        const editHeader = headerRow.insertCell(); // New column for "Edit" button
        dateHeader.textContent = "Date";
        amountHeader.textContent = "Amount";
        editHeader.textContent = "Edit"; // Header text for "Edit" button column
        // Create table rows
        for (let payment of payments) {
          const row = paymentTable.insertRow();
          const dateCell = row.insertCell();
          const amountCell = row.insertCell();
          const editCell = row.insertCell(); // New column for "Edit" button
          const deleteCell = row.insertCell(); // New column for "Delete" button
          dateCell.textContent = payment.date;
          amountCell.textContent = payment.payment;
          const editButton = document.createElement("button");
          const deleteButton = document.createElement("button"); // Create a "Delete" button
          editButton.textContent = "Edit";
          deleteButton.textContent = "Delete"; // Set the text of the "Delete" button
          editButton.addEventListener("click", () => showEditForm({ ...payment, rowIndex: row.rowIndex }));
          deleteButton.addEventListener("click", () => deletePayment(payment.id)); // Add an event listener to the "Delete" button
          editCell.appendChild(editButton);
          deleteCell.appendChild(deleteButton); // Append the "Delete" button to the deleteCell
        }
        paymentTotal.textContent = `Total Payment: ${totalPayment}`;
        // Second fetch call
        fetch(`http://arch.francecentral.cloudapp.azure.com:43704/list-projects`)
          .then(response => response.json())
          .then(projects => {
            const project = projects.find(project => project.id === projectId);
            const projectPrice = project.price;
            projectPriceEl.textContent = `Project: ${projectPrice}`;
                   
          })
          .catch(error => console.error(error));
      })
      .catch(error => console.error(error));
  }
});

function deletePayment(paymentId) {
  fetch(`http://arch.francecentral.cloudapp.azure.com:43704/delete-payment/${paymentId}`, {
    method: "DELETE"
  })
    .then(response => response.json())
    .then(data => {
      // Remove the payment row from the table
      const row = paymentTable.rows[data.rowIndex];
      row.remove();
      paymentTotal.textContent = `Total Payment: ${data.totalPayment}`;
      // Display confirmation message
      window.alert("Payment has been deleted.");
      // Refresh the form
      location.reload();
    })
    .catch(error => console.error(error));
}


//function to display the edit form
function showEditForm(poaymentform) {
  // Create the form elements
  const form = document.createElement("form");
  const dateInput = document.createElement("input");
  const amountInput = document.createElement("input");
  const submitButton = document.createElement("button");
  // Set the form properties
  form.addEventListener("submit", event => {
    event.preventDefault();
    const date = dateInput.value;
    const payment = amountInput.value;
    const paymentId = poaymentform.id;
    fetch(`http://arch.francecentral.cloudapp.azure.com:43704/update-payments/${paymentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        payment: payment,
        date: new Date(date).toISOString().slice(0, 10) // convert date to ISO format (YYYY-MM-DD)
      })
    })
      .then(response => response.json())
      .then(updatedPayment => {
        // Update the payment in the table
        const row = paymentTable.rows[poaymentform.rowIndex];
        row.cells[0].textContent = updatedPayment.date;
        row.cells[1].textContent = updatedPayment.payment;
        // Hide the form
        form.remove();
      })
      .catch(error => console.error(error));
  });
  dateInput.type = "date";
  dateInput.value = poaymentform.date;
  amountInput.type = "number";
  amountInput.value = poaymentform.payment;
  submitButton.type = "submit";
  submitButton.textContent = "Save";
  // Append the form to the table row
  const row = paymentTable.rows[poaymentform.rowIndex];
  const editCell = row.insertCell();
  editCell.appendChild(form);
  form.appendChild(dateInput);
  form.appendChild(amountInput);
  form.appendChild(submitButton);
}
//end function to display the edit form
