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
        dateHeader.textContent = "Date";
        amountHeader.textContent = "Amount";
        // Create table rows
        for (let payment of payments) {
          const row = paymentTable.insertRow();
          const dateCell = row.insertCell();
          const amountCell = row.insertCell();
          const editCell = row.insertCell(); // Add a new cell for the edit button
          dateCell.textContent = payment.date;
          amountCell.textContent = payment.payment;
          editCell.innerHTML = "<button class='edit-btn'>Edit</button>"; // Add an edit button to the row
          dateCell.classList.add("date-cell"); // Add a class name to the date cell
          amountCell.classList.add("amount-cell"); // Add a class name to the amount cell
        }
        
        paymentTable.addEventListener("click", event => {
          if (event.target.classList.contains("edit-btn")) {
            const row = event.target.parentNode.parentNode;
            const dateCell = row.querySelector(".date-cell");
            const amountCell = row.querySelector(".amount-cell");
            const editCell = row.querySelector(":nth-child(3)"); // Get the edit button cell
            const dateValue = dateCell.textContent;
            const amountValue = amountCell.textContent;
            dateCell.innerHTML = `<input type='date' value='${dateValue}'>`;
            amountCell.innerHTML = `<input type='number' step='0.01' value='${amountValue}'>`;
            editCell.innerHTML = "<button class='save-btn'>Save</button>"; // Replace the edit button with a Save button
          }
        });

        paymentTable.addEventListener("click", event => {
          if (event.target.classList.contains("save-btn")) {
            const row = event.target.parentNode.parentNode;
            const dateInput = row.querySelector("input[type='date']");
            const amountInput = row.querySelector("input[type='number']");
            const paymentId = row.dataset.paymentId;
            const newDate = dateInput.value;
            const newAmount = amountInput.value;
            const updatedPayment = { id: paymentId, date: newDate, payment: newAmount };
            fetch("http://arch.francecentral.cloudapp.azure.com:43704/update-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updatedPayment)
            })
              .then(response => response.json())
              .then(data => {
                console.log(data);
                projectSelect.dispatchEvent(new Event("change")); // Reload the payment table
              })
              .catch(error => console.error(error));
          }
        });
         

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
