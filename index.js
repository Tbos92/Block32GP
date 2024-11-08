const pg = require("pg");
const express = require("express");
const client = new pg.Client(
  process.env.DATABASE_URL ||
    "postgres://bosma:3892@localhost/the_acme_notes_db"
);
