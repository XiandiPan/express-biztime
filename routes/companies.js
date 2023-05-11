
const express = require("express");
const db = require("../db");
const { BadRequestError } = require("../expressError");
const router = express.Router();


router.get("/", async function(req, res, next){
  const results = await db.query(
    `SELECT code, name
      FROM  companies`
  );
  console.log("result",results);

  const companies = results.rows;

  console.log("rows",companies);

  return res.json({ companies });
})








































module.exports = router;