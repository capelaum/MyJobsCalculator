const Jobs = require("../models/Jobs");
const Profile = require("../models/Profile");
const JobUtils = require("../utils/jobUtils");

module.exports = {
  index(req, res) {
    const jobs = Jobs.get();
    const profile = Profile.get();
    let jobsTotalHours = 0;
    let status;

    let statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length,
    };

    const updatedJobs = jobs.map(job => {
      const remainingDays = JobUtils.calculateRemainingDays(job);
      const remainingHours = JobUtils.calculateRemainingHours(job);
      const remainingMinutes = JobUtils.calculateRemainingMinutes(job);

      if (remainingDays < 0) status = "done";
      if (remainingDays === 0) status = "today";
      if (remainingDays > 0) status = "progress";

      if (status === "today") statusCount["progress"] += 1;
      else statusCount[status] += 1;

      if (status === "today" || status === "progress")
        jobsTotalHours += Number(job["daily-hours"]);

      return {
        ...job,
        remainingDays,
        remainingHours,
        remainingMinutes,
        status,
        budget: JobUtils.calculateBudget(
          profile["value-hour"],
          job["total-hours"]
        ),
      };
    });

    const freeHours = (profile["hours-per-day"] - jobsTotalHours).toFixed();

    return res.render("index", {
      jobs: updatedJobs,
      profile,
      statusCount,
      freeHours,
    });
  },
};
