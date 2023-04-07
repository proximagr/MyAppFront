$(document).ready(function() {
    // Populate the customer select box with data from the /list-users API endpoint.
    $.get("http://arch.francecentral.cloudapp.azure.com:43704/list-users", function(data) {
      const customerSelect = $("#customer-select");
      data.forEach(function(customer) {
        const option = $("<option></option>");
        option.val(customer.id);
        option.text(customer.name);
        customerSelect.append(option);
      });
    });
  
    // When a customer is selected, retrieve their projects from the /list-projects API endpoint
    // and populate the projects table with the data.
    $("#customer-select").change(function() {
      const customerId = $(this).val();
      $.get(`http://arch.francecentral.cloudapp.azure.com:43704/list-projects?customerId=${customerId}`, function(data) {
        const projectsTableBody = $("#projects-table-body");
        projectsTableBody.empty();
        data.forEach(function(project) {
          const row = $("<tr></tr>");
          row.append($("<td></td>").text(project.id));
          row.append($("<td></td>").text(project.project));
          row.append($("<td></td>").text(project.price));
          projectsTableBody.append(row);
        });
        $("#projects-table").show();
      });
    });
  });
  