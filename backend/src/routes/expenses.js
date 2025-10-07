const express = require("express");
const router = express.Router();
const controller = require("../controllers/expenseController");
// const auth = require("../middleware/authMiddleware");

// router.use(auth);

router.post("/", controller.createExpense);
router.get("/", controller.getExpenses);
router.delete("/:id", controller.deleteExpense);
router.get("/balances", controller.getBalances);

module.exports = router;
