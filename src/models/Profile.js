let data = {
  name: "Luis",
  avatar: "https://github.com/capelaum.png",
  "monthly-budget": 1200,
  "days-per-week": 5,
  "hours-per-day": 6,
  "vacation-per-year": 4,
  "value-hour": 75,
};

module.exports = {
  get() {
    return data;
  },
  update(newData) {
    data = newData;
  }
}
