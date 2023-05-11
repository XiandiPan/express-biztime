
const express = require("express");
const db = require("../db");
const { BadRequestError } = require("../expressError");
const router = express.Router();


/** Get all companies */
router.get("/", async function (req, res, next) {
  const results = await db.query(
    `SELECT code, name
      FROM  companies`
  );
  // console.log("result",results);

  const companies = results.rows;

  // console.log("rows", companies);

  return res.json({ companies });
});


/** GET company by code */
router.get("/:code", async function (req, res, next) {
  const code = req.params.code;

  const results = await db.query(
    `SELECT code, name, description
    FROM companies
    WHERE code = $1`, [code]);

  const company = results.rows;
  if (company.length === 0) {
    throw new BadRequestError;
  }
  // console.log("Company =====", company);
  return res.json({ company });
});


/** Adds new company to DB */
router.post("/", async function (req, res, next) {
  if (!req.body) throw new BadRequestError();

  const { code, name, description } = req.body;
  const result = await db.query(
    `INSERT INTO companies (code, name, description)
           VALUES ($1, $2, $3)
           RETURNING code, name, description`,
    [code, name, description],
  );

  const company = result.rows[0];
  return res.status(201).json({ company });
});



























module.exports = router;