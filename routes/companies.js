
const express = require("express");
const db = require("../db");
const { BadRequestError } = require("../expressError");
const router = express.Router();


/** Get all companies, will return
 * {
	"companies": [
		{
			"code": "ibm",
			"name": "IBM"
		}
	]
}
*/
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
//--end


/** GET company by code, will return
 *
 * {
	"company": [
		{
			"code": "ibm",
			"name": "IBM",
			"description": "Big blue."
		}
	]
}
*/
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
//--end


/** Adds new company to DB, will return
 *{
	"company": [
		{
			"code": "microsoft",
			"name": "Microsoft",
			"description": "Maker of Windows OS."
		}
	]
}
 *
*/
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
//--end

/**Edit existing company.
 * edit
 *{


			"name": "Apple phone",
			"description": "phone"


}
return:
 * {
	"company": {
		"code": "apple",
		"name": "Apple phone",
		"description": "phone"
	}
}
*/

router.put("/:code", async function(req,res,next){
  console.log(req.body)
  if (!req.body) throw new BadRequestError();

  const {name, description} = req.body;

  console.log("*****name",req.body.name)
  const result = await db.query(
    `UPDATE companies
    SET name=$1,
    description=$2
    WHERE code=$3
    RETURNING code, name, description`,[name, description,req.params.code ]
  )

  console.log("** result===", result)

  const company = result.rows[0];
  return res.json({company})

})
//--end

/** Delete company*/

router.delete("/:code", async function (req, res, next) {
  await db.query(
    "DELETE FROM companies WHERE code = $1",
    [req.params.code],
  );
  return res.json({ message: "Deleted" });
});
//--end



module.exports = router;