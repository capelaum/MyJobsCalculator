const express = require("express");
const routes = express.Router();
const ProfileController = require('./controllers/ProfileController');

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
      id: 3,
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
          budget: Job.services.calculateBudget(
            Profile.data["value-hour"],
            job["total-hours"]
          ),
        };
      });

      return res.render("index", { jobs: updatedJobs });
    },

    create(req, res) {
      return res.render("job");
    },

    save(req, res) {
      const isValidJob = Job.services.validateJob(req.body);

      if (!isValidJob) {
        const errorMsg =
          "Job Inválido! Estimativa não pode ser menor que horas diárias para o Job";
        return res.redirect(`/?${errorMsg}`);
      }

      if (isValidJob) {
        const lastId = Job.data[Job.data.length - 1]?.id || 0;

        Job.data.push({
          id: lastId + 1,
          name: req.body.name,
          "daily-hours": req.body["daily-hours"],
          "total-hours": req.body["total-hours"],
          created_at: Date.now(),
        });
      }

      return res.redirect("/");
    },

    show(req, res) {
      const jobId = req.params.id;
      const job = Job.services.getJob(jobId, res);

      job.budget = Job.services.calculateBudget(
        Profile.data["value-hour"],
        job["total-hours"]
      );

      return res.render("job-edit", { job });
    },

    update(req, res) {
      const jobId = req.params.id;
      const job = Job.services.getJob(jobId, res);

      const updatedJob = {
        ...job,
        name: req.body.name,
        "total-hours": req.body["total-hours"],
        "daily-hours": req.body["daily-hours"],
      };

      Job.data = Job.data.map(job => {
        if (Number(job.id) === Number(jobId)) {
          job = updatedJob;
        }

        return job;
      });

      res.redirect("/job/" + jobId);
    },

    delete(req, res) {
      const jobId = req.params.id;

      Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId));

      return res.redirect("/");
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
    validateJob(job) {
      if (job["daily-hours"] > job["total-hours"]) {
        console.log(job["daily-hours"], job["total-hours"]);
        return false;
      }
      return true;
    },
    calculateBudget: (valueHour, totalHours) => valueHour * totalHours,
    getJob(jobId, res) {
      const job = Job.data.find(job => Number(job.id) === Number(jobId));

      if (!job) {
        return res.send("Job not found");
      }
      return job;
    },
  },
};

routes.get("/", Job.controllers.index);
routes.get("/job", Job.controllers.create);
routes.post("/job", Job.controllers.save);

routes.get("/job/:id", Job.controllers.show);
routes.post("/job/:id", Job.controllers.update);
routes.post("/job/delete/:id", Job.controllers.delete);

routes.get("/profile", ProfileController.index);
routes.post("/profile", ProfileController.update);

module.exports = routes;
