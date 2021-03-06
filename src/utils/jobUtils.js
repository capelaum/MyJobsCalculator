module.exports = {
  calculateRemainingDays(job) {
    // poe na forma de Data: Sat Apr 17 horario..
    const createdDate = new Date(job.created_at);

    const remainingDays = Math.ceil(job["total-hours"] / job["daily-hours"]);
    // console.log("π ~ remainingDays: ", remainingDays);

    // soma dia da data de criaΓ§Γ£o mais dias necessarios para entrega
    const dueDay = createdDate.getDate() + Number(remainingDays);

    // poe data de entrega em milisegundos
    const dueDateMs = createdDate.setDate(dueDay);

    // subtrai data de entrega com data atual em milisegundos
    const timeDiffMs = dueDateMs - Date.now();

    const dayMs = 1000 * 60 * 60 * 24;

    // transforma para dias restantes
    const daysLeft = Math.floor(timeDiffMs / dayMs);
    // console.log("π ~ daysLeft", daysLeft);

    return daysLeft;
  },

  calculateRemainingHours(job) {
    const hourMs = 1000 * 60 * 60;

    const dueTime = job.created_at + job["total-hours"] * hourMs;
    const timeLeft = dueTime - Date.now();
    // console.log("π ~ timeLeft", timeLeft);

    const hoursLeft = Math.floor((timeLeft / hourMs) % 24);
    // console.log("π ~ hoursLeft", hoursLeft);

    return hoursLeft;
  },

  calculateRemainingMinutes(job) {
    const hourMs = 1000 * 60 * 60;
    const minuteMs = 1000 * 60;

    const dueTime = job.created_at + job["total-hours"] * hourMs;
    const timeLeft = dueTime - Date.now();
    // console.log("π ~ timeLeft", timeLeft);

    const minutesLeft = Math.floor((timeLeft / minuteMs) % 60);
    // console.log("π ~ minutesLeft", minutesLeft);

    return minutesLeft;
  },

  calculateBudget: (valueHour, totalHours) => valueHour * totalHours,

  getJob(jobId, res) {},
};
