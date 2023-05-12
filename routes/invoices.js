const express = require("express");
const db = require("../db");
const { BadRequestError } = require("../expressError");
const router = express.Router();


/** Get json of all invoices id & comp_code:
 *return ex:
 *{
  "invoices": [
    {
      "id": 1,
      "comp_code": "apple"
    },
    {
      "id": 2,
      "comp_code": "apple"
    },
    {
      "id": 3,
      "comp_code": "apple"
    },
    {
      "id": 4,
      "comp_code": "ibm"
    }
  ]
}
 */
router.get("/", async function (req, res, next) {
  const results = await db.query(
    `SELECT id, comp_code
           FROM invoices`);

  console.log("results=", results);

  const invoices = results.rows;

  console.log("rows=", invoices);

  return res.json({ invoices });
});


/**Get specific invoice by id
 *
 * return example:
 */
router.get("/:id", async function (req, res, next) {
  const id = req.params.id;

  const invoiceResults = await db.query(`SELECT id, amt, paid, add_date, paid_date, comp_code
  FROM invoices WHERE id=$1`, [id]);
  const invoice = invoiceResults.rows[0];

  const companyResults = await db.query(`SELECT code, name, description FROM companies WHERE code=$1`,
    [invoiceResults.rows[0].comp_code]);
  const company = companyResults.rows[0];

  invoice.company = company;
  delete invoice.comp_code;

  return res.json(invoice);

});















module.exports = router;