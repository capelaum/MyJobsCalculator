const Jobs = require("../models/Jobs");
const Profile = require("../models/Profile");
const JobUtils = require("../utils/jobUtils");

module.exports = {
  index(req, res) {
    const jobs = Jobs.get();
    const profile = Profile.get();

    let statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length,
    };

    const updatedJobs = jobs.map(job => {
      const remainingDays = JobUtils.calculateRemainingTime(job);
      let status;

      if (remainingDays < 0) status = "done";
      if (remainingDays === 0) status = "today";
      if (remainingDays > 0) status = "progress";

      if(status === "today") 
        statusCount["progress"] += 1;
      else
        statusCount[status] += 1;

      return {
        ...job,
        remainingDays,
        status,
        budget: JobUtils.calculateBudget(
          profile["value-hour"],
          job["total-hours"]
        ),
      };
    });

    return res.render("index", { jobs: updatedJobs, profile, statusCount });
  },
};
