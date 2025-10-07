const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

router.use(auth);
const {
  createGroup,
  getUserGroups,
  getGroupById,
} = require("../controllers/groupController");
const {
  createGroupExpense,
  getGroupExpenses,
  getGroupBalances,
  updateGroupExpense,
  deleteGroupExpense,
} = require("../controllers/groupExpenseController");

// Group management
router.post("/", createGroup);
router.get("/", getUserGroups);
router.get("/:id", getGroupById);

// Group expenses
router.post("/expense", createGroupExpense);
router.get("/expenses/:groupId", getGroupExpenses);
router.get("/balances/:groupId", getGroupBalances);
router.put("/expenses/:id", updateGroupExpense);
router.delete("/expenses/:id", deleteGroupExpense);

module.exports = router;
