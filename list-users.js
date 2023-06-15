document.addEventListener("DOMContentLoaded", function () {
  const listUsersButton = document.querySelector("#list-users-btn");

  listUsersButton.addEventListener("click", function () {
    window.archpro.fetch("/list-users")
      .then((data) => {
        // Sort users by name
        data.sort((a, b) => a.name.localeCompare(b.name));
        const table = document.querySelector("#users-table");
        table.innerHTML = "";
        data.forEach((user) => {
          const row = table.insertRow();
          const idCell = row.insertCell(0);
          const nameCell = row.insertCell(1);

          idCell.innerHTML = user.id;
          nameCell.innerHTML = user.name;

          const editCell = row.insertCell(2);
          const editButton = document.createElement("button");
          editButton.textContent = "Edit";
          editButton.addEventListener("click", function () {
            editUser(user.id, user.name); // Pass user ID and name to the editUser function
          });
          editCell.appendChild(editButton);
        });
      })
      .catch((error) => console.error(error));
  });
});

// close users-table
document.addEventListener("DOMContentLoaded", function () {
  const closeTableButton = document.querySelector("#close-table-btn");

  closeTableButton.addEventListener("click", function () {
    const table = document.querySelector("#users-table");
    table.innerHTML = "";
  });
});

function editUser(userId, userName) {
  const newName = prompt("Enter the new name for the user", userName);
  if (newName !== null) {
    const updatedUser = {
      id: userId,
      name: newName
    };

    window.archpro.fetch("/edit-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("authToken")
      },
      body: JSON.stringify(updatedUser)
    })
      .then((response) => {
        if (response && response.message) {
          alert(response.message);
          // You can perform additional actions if needed
          const closeTableButton = document.querySelector("#close-table-btn");
          closeTableButton.dispatchEvent(new Event("click"));
        } else {
          throw new Error("Failed to update user");
        }
      })
      .catch((error) => {
        console.error(error);
        alert(`Failed to update user: ${error.message}`);
      });
  }
}

