const Jobs = require("../models/Jobs");
const Profile = require("../models/Profile");
const JobUtils = require("../utils/JobUtils");

module.exports = {
  create(req, res) {
    return res.render("job");
  },

  async save(req, res) {
    const jobs = await Jobs.get();
    const isValidJob = JobUtils.validateJob(req.body);

    if (!isValidJob) {
      const errorMsg =
        "Job Inválido! Estimativa não pode ser menor que horas diárias para o Job";
      return res.redirect(`/?${errorMsg}`);
    }

    if (isValidJob) {
      const lastId = jobs[jobs.length - 1]?.id || 0;

      Jobs.create({
        id: lastId + 1,
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],
        created_at: Date.now(),
      });
    }

    return res.redirect("/");
  },

  async show(req, res) {
    const jobId = req.params.id;
    const jobs = await Jobs.get();
    const job = jobs.find(job => Number(job.id) === Number(jobId));
    const profile = await Profile.get();

    if (!job) {
      return res.send("Job not found");
    }

    job.budget = JobUtils.calculateBudget(
      profile["value-hour"],
      job["total-hours"]
    );

    return res.render("job-edit", { job });
  },

  async update(req, res) {
    let jobs = await Jobs.get();
    const jobId = req.params.id;
    const job = jobs.find(job => Number(job.id) === Number(jobId));

    if (!job) {
      return res.send("Job not found");
    }

    const updatedJob = {
      ...job,
      name: req.body.name,
      "total-hours": req.body["total-hours"],
      "daily-hours": req.body["daily-hours"],
    };

    const newJobs = jobs.map(job => {
      if (Number(job.id) === Number(jobId)) {
        job = updatedJob;
      }

      return job;
    });

    Jobs.update(newJobs);

    res.redirect("/job/" + jobId);
  },

  delete(req, res) {
    const jobId = req.params.id;
    Jobs.delete(jobId);

    return res.redirect("/");
  },
};
