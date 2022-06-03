var express = require("express");
var app = express();
const bodyParser = require("body-parser");

const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const connectionString = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;

const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(bodyParser.json());
app.set("port", process.env.PORT || 3000);

app.get("/scores", (request, response) => {
  pool.query(`SELECT * FROM Scores;`, (err, res) => {
    if (err) {
      console.log("Error - Failed to select all from Scores");
      console.log(err);
      response.end();
    } else {
      response.json(res?.rows);
      response.end();
    }
  });
});

app.post("/scores", (request, response) => {
  const { username, point, game } = request.body;

  pool.query(
    `INSERT INTO Scores(username, point, game) VALUES ($1, $2, $3)`,
    [username, point, game],
    (err, res) => {
      if (err) {
        console.log("Error - Fail to insert to Scores");
        console.log(err);
      } else {
        console.log("Score Inserted!");
      }
    }
  );

  response.json({ username, point, game });
  response.end();
});

app.listen(app.get("port"), () => {
  console.log("Node app is running at localhost:" + app.get("port"));
  pool.query(`SELECT * FROM Scores;`, (err, res) => {
    if (err) {
      console.log("Error - Failed to select all from Scores");
      console.log(err);
    } else {
      console.log("Connect to database successfully!");
    }
  });
});
