document.addEventListener("DOMContentLoaded", function () {
  const listUsersButton = document.querySelector("#list-users-btn");
  const usersTableBody = document.querySelector("#users-table tbody");

  listUsersButton.addEventListener("click", function () {
    fetch("http://arch.francecentral.cloudapp.azure.com:43704/list-users")
      .then((response) => response.json())
      .then((data) => {
        usersTableBody.innerHTML = "";
        data.forEach((user) => {
          const row = usersTableBody.insertRow();
          const nameCell = row.insertCell(0);
          nameCell.innerHTML = user.name;
        });
      })
      .catch((error) => console.error(error));
  });
});
