const express = require("express");
const routes = express.Router();

const views = `${__dirname}/views/`;

const Profile = {
  data: {
    name: "Luis",
    avatar: "https://github.com/capelaum.png",
    "monthly-budget": 1200,
    "days-per-week": 5,
    "hours-per-day": 6,
    "vacation-per-year": 2,
    "value-hour": 75,
  },

  controllers: {
    index(req, res) {
      return res.render(`${views}profile`, { profile: Profile.data });
    },

    update(req, res) {
      const data = req.body;
      const weeksPerYear = 52;
      const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12;
      const weekTotalHours = data["hours-per-day"] * data["days-per-week"];
      const monthlyTotalHours = weekTotalHours * weeksPerMonth;

      const valueHour = data["monthly-budget"] / monthlyTotalHours;

      Profile.data = {
        ...Profile.data,
        ...req.body,
        "value-hour": valueHour,
      };

      return res.redirect("/profile");
    },
  },
};

const Job = {
  data: [
    {
      id: 1,
      name: "Pizzaria Guloso",
      "daily-hours": 2,
      "total-hours": 2,
      created_at: Date.now(),
    },
    {
      id: 2,
      name: "OneTwo Project",
      "daily-hours": 4,
      "total-hours": 40,
      created_at: Date.now(),
    },
    {
      id: 2,
      name: "Away Project",
      "daily-hours": 0.5,
      "total-hours": 1,
      created_at: Date.now(),
    },
  ],

  controllers: {
    index(req, res) {
      const updatedJobs = Job.data.map(job => {
        const remainingDays = Job.services.calculateRemainingTime(job);

        let status;

        if (remainingDays < 0) status = "done";
        if (remainingDays === 0) status = "today";
        if (remainingDays > 0) status = "progress";

        return {
          ...job,
          remainingDays,
          status,
          budget: Profile.data["value-hour"] * job["total-hours"],
        };
      });

      return res.render(`${views}index`, { jobs: updatedJobs });
    },

    create(req, res) {
      return res.render(`${views}job`);
    },

    save(req, res) {
      // req.body: { name: 'Luis', 'daily-hours': '3.3', 'total-hours': '2' }
      const isValidJob = Job.controllers.validateJob(req.body);

      if (!isValidJob) {
        const errorMsg =
          "Job Inválido! Estimativa não pode ser menor que horas diárias para o Job";
        return res.redirect(`/?${errorMsg}`);
      }

      if (isValidJob) {
        // const lastId = Job.data[Job.data.length - 1]?.id || 1;
        const lastId = Job.data.length + 1;

        Job.data.push({
          id: lastId,
          name: req.body.name,
          "daily-hours": req.body["daily-hours"],
          "total-hours": req.body["total-hours"],
          created_at: Date.now(),
        });
      }

      return res.redirect("/");
    },

    validateJob(job) {
      if (job["daily-hours"] > job["total-hours"]) {
        console.log(job["daily-hours"], job["total-hours"]);
        return false;
      }
      return true;
    },
  },

  services: {
    calculateRemainingTime(job) {
      // poe na forma de Data: Sat Apr 17 horario..
      const createdDate = new Date(job.created_at);

      const remainingDays = Math.ceil(job["total-hours"] / job["daily-hours"]);
      console.log("🚀 ~ remainingDays: ", remainingDays);

      // soma dia da data de criação mais dias necessarios para entrega
      const dueDay = createdDate.getDate() + Number(remainingDays);

      // poe data de entrega em milisegundos
      const dueDateMs = createdDate.setDate(dueDay);

      // subtrai data de entrega com data atual em milisegundos
      const timeDiffMs = dueDateMs - Date.now();

      const dayMs = 1000 * 60 * 60 * 24;
      const hourMs = 1000 * 60 * 60;
      const minuteMs = 1000 * 60;

      // transforma para dias restantes
      const daysLeft = Math.floor(timeDiffMs / dayMs);
      console.log("🚀 ~ daysLeft", daysLeft);

      if (daysLeft <= 1) {
        const dueTime = job.created_at + job["total-hours"] * hourMs;
        const timeLeft = dueTime - Date.now();
        console.log("🚀 ~ timeLeft", timeLeft);

        const hoursLeft = Math.floor((timeLeft / hourMs) % 24);
        console.log("🚀 ~ hoursLeft", hoursLeft);

        const minutesLeft = Math.floor((timeLeft / minuteMs) % 60);
        console.log("🚀 ~ minutesLeft", minutesLeft);
      }

      console.log("-----------------");
      return daysLeft;
    },
  },
};

routes.get("/", Job.controllers.index);
routes.get("/job", Job.controllers.create);
routes.post("/job", Job.controllers.save);

routes.get("/job/edit", (req, res) => res.render(`${views}job-edit`));
routes.get("/profile", Profile.controllers.index);
routes.post("/profile", Profile.controllers.update);

module.exports = routes;
