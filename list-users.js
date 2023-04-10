document.addEventListener("DOMContentLoaded", function () {
  const listUsersButton = document.querySelector("#list-users-btn");

  listUsersButton.addEventListener("click", function () {
    fetch("http://arch.francecentral.cloudapp.azure.com:43704/list-users", )
      .then((response) => response.json())
      .then((data) => {
        const table = document.querySelector("#users-table");
        table.innerHTML = "";
        data.forEach((user) => {
          const row = table.insertRow();
          const idCell = row.insertCell(0);
          const nameCell = row.insertCell(0);
          idCell.innerHTML = user.id;
          nameCell.innerHTML = user.name;
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
