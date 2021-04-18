module.exports = {
  calculateRemainingDays(job) {
    // poe na forma de Data: Sat Apr 17 horario..
    const createdDate = new Date(job.created_at);

    const remainingDays = Math.ceil(job["total-hours"] / job["daily-hours"]);
    // console.log("🚀 ~ remainingDays: ", remainingDays);

    // soma dia da data de criação mais dias necessarios para entrega
    const dueDay = createdDate.getDate() + Number(remainingDays);

    // poe data de entrega em milisegundos
    const dueDateMs = createdDate.setDate(dueDay);

    // subtrai data de entrega com data atual em milisegundos
    const timeDiffMs = dueDateMs - Date.now();

    const dayMs = 1000 * 60 * 60 * 24;

    // transforma para dias restantes
    const daysLeft = Math.floor(timeDiffMs / dayMs);
    // console.log("🚀 ~ daysLeft", daysLeft);

    console.log("-----------------");
    return daysLeft;
  },

  calculateRemainingHours(job) {
    const hourMs = 1000 * 60 * 60;

    const dueTime = job.created_at + job["total-hours"] * hourMs;
    const timeLeft = dueTime - Date.now();
    // console.log("🚀 ~ timeLeft", timeLeft);

    const hoursLeft = Math.floor((timeLeft / hourMs) % 24);
    // console.log("🚀 ~ hoursLeft", hoursLeft);

    return hoursLeft;
  },

  calculateRemainingMinutes(job) {
    const hourMs = 1000 * 60 * 60;
    const minuteMs = 1000 * 60;

    const dueTime = job.created_at + job["total-hours"] * hourMs;
    const timeLeft = dueTime - Date.now();
    // console.log("🚀 ~ timeLeft", timeLeft);

    const minutesLeft = Math.floor((timeLeft / minuteMs) % 60);
    // console.log("🚀 ~ minutesLeft", minutesLeft);

    return minutesLeft;
  },

  validateJob(job) {
    if (Number(job["daily-hours"]) > Number(job["total-hours"])) {
      console.log(job["daily-hours"], job["total-hours"]);
      return false;
    }
    return true;
  },

  calculateBudget: (valueHour, totalHours) => valueHour * totalHours,

  getJob(jobId, res) {},
};
