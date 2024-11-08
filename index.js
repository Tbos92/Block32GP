const pg = require("pg");
const express = require("express");
const app = express();
const client = new pg.Client(
  process.env.DATABASE_URL ||
    "postgres://bosma:3892@localhost/the_acme_notes_db"
);

const init = async () => {
  const port = process.env.PORT || 3000;
  application.listen(port, () => console.log(`listening on port ${port}`));
};
init();
