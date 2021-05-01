const Jobs = require("../models/Jobs");
const Profile = require("../models/Profile");
const JobUtils = require("../utils/jobUtils");

module.exports = {
  create(req, res) {
    return res.render("job");
  },

  async save(req, res) {

    await Jobs.create({
      name: req.body.name,
      "daily-hours": req.body["daily-hours"],
      "total-hours": req.body["total-hours"],
      created_at: Date.now(),
    });

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
    const jobId = req.params.id;

    const updatedJob = {
      name: req.body.name,
      "total-hours": req.body["total-hours"],
      "daily-hours": req.body["daily-hours"],
    };

    await Jobs.update(updatedJob, jobId);

    res.redirect("/job/" + jobId);
  },

  async delete(req, res) {
    const jobId = req.params.id;
    await Jobs.delete(jobId);

    return res.redirect("/");
  },
};
