
const { FAQ, Question, Statistics } = require("../models/FAQ");

/* ======================================================
   FAQ CONTROLLERS
====================================================== */

// Create FAQ
exports.createFAQ = async (req, res) => {
  try {
    const faq = await FAQ.create(req.body);
    res.status(201).json({ success: true, data: faq });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get all FAQs (with search & filters)
exports.getFAQs = async (req, res) => {
  try {
    const { search, category, published } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (published !== undefined) filter.isPublished = published === "true";

    if (search) {
      filter.$text = { $search: search };
    }

    const faqs = await FAQ.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: faqs.length, data: faqs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single FAQ
exports.getFAQById = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) return res.status(404).json({ success: false, message: "FAQ not found" });

    faq.views += 1;
    await faq.save();

    res.json({ success: true, data: faq });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update FAQ
exports.updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: faq });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete FAQ
exports.deleteFAQ = async (req, res) => {
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "FAQ deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   QUESTION CONTROLLERS
====================================================== */

// Submit Question
exports.submitQuestion = async (req, res) => {
  try {
    const question = await Question.create({
      ...req.body,
      metadata: {
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        referrer: req.headers.referer,
      },
    });

    res.status(201).json({ success: true, data: question });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get Questions (admin)
exports.getQuestions = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) filter.question = { $regex: search, $options: "i" };

    const questions = await Question.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: questions.length, data: questions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getQuestionsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { status, category, search } = req.query;

    const filter = { email: email.toLowerCase() };

    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) filter.question = { $regex: search, $options: "i" };

    const questions = await Question.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Answer Question
exports.answerQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      {
        answer: req.body.answer,
        status: "answered",
        answeredAt: new Date(),
        isRead: true,
      },
      { new: true }
    );

    res.json({ success: true, data: question });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Delete Question
exports.deleteQuestion = async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Question deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ======================================================
   DASHBOARD STATISTICS
====================================================== */

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalFAQs,
      publishedFAQs,
      totalQuestions,
      pendingQuestions,
      answeredQuestions,
      todayFAQs,
      todayQuestions,
      faqViews
    ] = await Promise.all([
      FAQ.countDocuments(),
      FAQ.countDocuments({ isPublished: true }),
      Question.countDocuments(),
      Question.countDocuments({ status: "pending" }),
      Question.countDocuments({ status: "answered" }),
      FAQ.countDocuments({ createdAt: { $gte: today } }),
      Question.countDocuments({ createdAt: { $gte: today } }),
      FAQ.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }])
    ]);

    res.json({
      success: true,
      data: {
        faqStats: {
          totalFAQs,
          publishedFAQs,
          newFAQs: todayFAQs,
          faqViews: faqViews[0]?.total || 0,
        },
        questionStats: {
          totalQuestions,
          pendingQuestions,
          answeredQuestions,
          newQuestions: todayQuestions,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
