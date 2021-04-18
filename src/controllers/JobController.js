const Jobs = require("../models/Jobs");
const Profile = require("../models/Profile");
const jobUtils = require("../utils/jobUtils");

module.exports = {
  index(req, res) {
    const jobs = Jobs.get();
    const profile = Profile.get();

    const updatedJobs = jobs.map(job => {
      const remainingDays = jobUtils.calculateRemainingTime(job);
      let status;

      if (remainingDays < 0) status = "done";
      if (remainingDays === 0) status = "today";
      if (remainingDays > 0) status = "progress";

      return {
        ...job,
        remainingDays,
        status,
        budget: jobUtils.calculateBudget(
          profile["value-hour"],
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
    const jobs = Jobs.get();
    const isValidJob = jobUtils.validateJob(req.body);

    if (!isValidJob) {
      const errorMsg =
        "Job Inválido! Estimativa não pode ser menor que horas diárias para o Job";
      return res.redirect(`/?${errorMsg}`);
    }

    if (isValidJob) {
      const lastId = jobs[jobs.length - 1]?.id || 0;

      jobs.push({
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
    const jobs = Jobs.get();
    const jobId = req.params.id;
    const job = jobs.find(job => Number(job.id) === Number(jobId));
    const profile = Profile.get();

    if (!job) {
      return res.send("Job not found");
    }

    job.budget = jobUtils.calculateBudget(
      profile["value-hour"],
      job["total-hours"]
    );

    return res.render("job-edit", { job });
  },

  update(req, res) {
    let jobs = Jobs.get();
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
