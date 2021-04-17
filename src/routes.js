const express = require("express");
const routes = express.Router();

const views = `${__dirname}/views/`;

const profile = {
  name: "Luis",
  avatar: "https://github.com/capelaum.png",
  "monthly-budget": 1200,
  "days-per-week": 5,
  "hours-per-day": 6,
  "vacation-per-year": 2,
  "value-hour": 75,
};

const jobs = [
  {
    id: 1,
    name: "Pizzaria Guloso",
    "daily-hours": 2,
    "total-hours": 1,
    created_at: Date.now(),
  },
  {
    id: 2,
    name: "OneTwo Project",
    "daily-hours": 4,
    "total-hours": 40,
    created_at: Date.now(),
  },
];

const calculateRemainingDays = job => {
  // poe na forma de Data: Sat Apr 17 horario..
  const createdDate = new Date(job.created_at);
  const remainingDays = Math.ceil(job["total-hours"] / job["daily-hours"]);

  // soma dia da data de criação mais dias necessarios para entrega: 27
  const dueDay = createdDate.getDate() + Number(remainingDays);

  // poe data de entrega em milisegundos
  const dueDateMs = createdDate.setDate(dueDay);

  // subtrai data de entrega com data atual em milisegundos
  const timeDiffMs = dueDateMs - Date.now();

  // dia em milisegundos
  const dayMs = 1000 * 60 * 60 * 24;

  // transforma para dias restantes
  const dayDiff = Math.floor(timeDiffMs / dayMs);

  return dayDiff;
};

routes.get("/", (req, res) => {
  const updatedJobs = jobs.map(job => {
    const remainingDays = calculateRemainingDays(job);
    const status = remainingDays <= 0 ? "done" : "progress";

    return {
      ...job,
      remainingDays,
      status,
      budget: profile["value-hour"] * job["total-hours"],
    };
  });

  return res.render(`${views}index`, { jobs: updatedJobs });
});

routes.get("/job", (req, res) => res.render(`${views}job`));
routes.post("/job", (req, res) => {
  // req.body: { name: 'Luis', 'daily-hours': '3.3', 'total-hours': '2' }

  // const jobId = jobs[jobs.length - 1]?.id || 1;
  const jobId = jobs.length + 1;

  jobs.push({
    id: jobId,
    name: req.body.name,
    "daily-hours": req.body["daily-hours"],
    "total-hours": req.body["total-hours"],
    created_at: Date.now(),
  });

  return res.redirect("/");
});

routes.get("/job/edit", (req, res) => res.render(`${views}job-edit`));
routes.get("/profile", (req, res) =>
  res.render(`${views}profile`, { profile })
);

module.exports = routes;
