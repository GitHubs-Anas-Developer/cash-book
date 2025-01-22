const express = require("express");
const router = express.Router();
const protectRoute = require("../middleware/protectRoute");
const {
  createNotebook,
  getNotebooks,
  getNotebookById,
  deleteNotebook,
} = require("../controllers/notebookController");

router.post("/create", protectRoute, createNotebook);
router.get("/", protectRoute, getNotebooks);
router.get("/single/:id", protectRoute, getNotebookById);
// router.put('/:id', notebookController.updateNotebook);
router.delete("/:id", protectRoute, deleteNotebook);

module.exports = router;
