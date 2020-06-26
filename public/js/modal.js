$('#confirmModal').on('show.bs.modal', function (event) {
  var button = $(event.relatedTarget) // Button that triggered the modal
  var userId = button.data('whatever') // Extract info from data-* attributes
  $("#user-id").val(userId);
})