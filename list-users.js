document.addEventListener("DOMContentLoaded", function () {
    const listUsersButton = document.querySelector("#list-users-btn");
  
    listUsersButton.addEventListener("click", function () {
      fetch("http://10.1.0.4:3000/list-users")
        .then((response) => response.json())
        .then((data) => {
          const table = document.querySelector("#users-table");
          table.innerHTML = "";
          data.forEach((user) => {
            const row = table.insertRow();
            const nameCell = row.insertCell(0);
            nameCell.innerHTML = user.name;
          });
        })
        .catch((error) => console.error(error));
    });
  });
  