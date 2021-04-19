const Database = require("./config");

const initDb = {
  async init() {

    const db = await Database();

    await db.exec(`CREATE TABLE IF NOT EXISTS profile (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        avatar TEXT,
        monthly_budget INT,
        days_per_week INT,
        hours_per_day INT,
        vacation_per_year INT,
        value_hour INT
      );`
    );

    await db.exec(`CREATE TABLE IF NOT EXISTS jobs(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        daily_hours INT,
        total_hours INT,
        created_at DATETIME
      );`
    );

    await db.run(`INSERT INTO profile (
        name, 
        avatar, 
        monthly_budget, 
        days_per_week, 
        hours_per_day, 
        vacation_per_year,
        value-hour
      ) VALUES (
        "Luis",
        "https://github.com/capelaum.png",
        1200,
        5,
        6,
        4,
        50
      );`
    );

    await db.run(`INSERT INTO jobs (
      name, 
      daily_hours, 
      total_hours, 
      created_at
      ) VALUES (
        "Artur Orgânicos",
        2,
        50,
        1618780267510
      );`
    );

    await db.run(`INSERT INTO jobs (
      name, 
      daily_hours, 
      total_hours, 
      created_at
      ) VALUES (
        "Carol Website",
        2,
        30,
        1618780267510
      );`
    );

    await db.close();
  },
}

initDb.init();