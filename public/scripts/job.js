const nameInput = document.getElementById("name");
const submitBtn = document.getElementById("submit-btn");
const dailyHoursInput = document.getElementById("daily-hours");
const totalHoursInput = document.getElementById("total-hours");

submitBtn.addEventListener("click", el => {
  if (dailyHoursInput.value > totalHoursInput.value) {
    el.preventDefault();
    alert("Horas diárias não pode ser maior que total de horas!");
  }
});
