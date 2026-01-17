
const express = require("express");
const router = express.Router();

const faqController = require("../controllers/faqController");

/* ======================================================
   FAQ ROUTES (PUBLIC)
====================================================== */

// Get all published FAQs
router.get("/", faqController.getFAQs);

// Get single FAQ by Email (increments views)
router.get("/:email", faqController.getQuestionsByEmail);
// Get single FAQ by ID (increments views)
router.get("/:id", faqController.getFAQById);



// Submit a new question
router.post("/questions", faqController.submitQuestion);

/* ======================================================
   FAQ ROUTES (ADMIN)
====================================================== */

// Create FAQ
router.post("/", faqController.createFAQ);

// Update FAQ
router.put("/:id", faqController.updateFAQ);

// Delete FAQ
router.delete("/:id", faqController.deleteFAQ);

// Get all questions (admin)
router.get("/admin/questions", faqController.getQuestions);

// Answer a question
router.put("/admin/questions/:id/answer", faqController.answerQuestion);

// Delete question
router.delete("/admin/questions/:id", faqController.deleteQuestion);

/* ======================================================
   STATISTICS
====================================================== */

// Dashboard statistics
router.get("/admin/statistics", faqController.getDashboardStats);

module.exports = router;
