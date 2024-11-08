const pg = require("pg");
const express = require("express");
const app = express();
const client = new pg.Client(
  process.env.DATABASE_URL ||
    "postgres://bosma:3892@localhost/the_acme_notes_db"
);

app.use(require("morgan")("dev"));
app.use(express.json());

app.get("/api/notes", async (req, res, next) => {
  try {
    const SQL = /* sql */ `SELECT * from notes ORDER BY created_at DESC`;

    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

app.post("/api/notes", async (req, res, next) => {
  try {
    const SQL = /* sql */ `
        INSERT INTO notes(txt)
        VALUES($1)
        RETURNING *
        `;
    const response = await client.query(SQL, [req.body.txt]);
    res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.put("/api/notes/:id", async (req, res, next) => {
  try {
    const SQL = /* sql */ `
        UPDATE notes
        SET txt=$1, ranking=$2, updated_at= now()
        WHERE id=$3 RETURNING *
      `;
    const response = await client.query(SQL, [
      req.body.txt,
      req.body.ranking,
      req.params.id,
    ]);
    res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/notes/:id", async (req, res, next) => {
  try {
    const SQL = /* sql */ `
        DELETE from notes
        WHERE id = $1
      `;
    const response = await client.query(SQL, [req.params.id]);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

const init = async () => {
  await client.connect();
  console.log("connected to database");
  let SQL = /* sql */ `
    DROP TABLE IF EXISTS notes;
    CREATE TABLE notes(
    id SERIAL PRIMARY KEY,
    txt VARCHAR(200) NOT NULL,
    ranking INTEGER DEFAULT 5 NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
    );
    `;
  await client.query(SQL);
  console.log("tables created");

  SQL = /* sql */ `
    INSERT INTO notes(txt) VALUES('learn SQL');
    INSERT INTO notes(txt, ranking) VALUES('walk lincoln', 4);
    INSERT INTO notes(txt) VALUES('learn express routes');
  `;
  await client.query(SQL);
  console.log("data seeded");

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`listening on port ${port}`));
};
init();
