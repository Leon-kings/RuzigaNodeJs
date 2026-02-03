const mongoose = require('mongoose')
const cloudinary = require("../cloudinary/cloudinary");
const { University, Booking } = require("../models/AdmissionSystem");
const streamifier = require("streamifier");

/* ===================== CLOUDINARY SERVICE ===================== */
class CloudinaryService {
  uploadFromBuffer(buffer, folder = "universities") {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, quality: "auto" },
        (err, result) => {
          if (err) return reject(err);
          resolve({ public_id: result.public_id, url: result.secure_url });
        },
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });
  }

  async uploadMultiple(files) {
    const images = [];
    for (const file of files) {
      images.push(await this.uploadFromBuffer(file.buffer));
    }
    return images;
  }

  async deleteMultiple(ids) {
    for (const id of ids) await cloudinary.uploader.destroy(id);
  }
}

const cloudinaryService = new CloudinaryService();
const DEFAULT_IMAGE = [
  {
    public_id: "default",
    url: "https://wenr.wes.org/wp-content/uploads/2019/09/iStock-1142918319_WENR_Ranking_740_430.jpg",
  },
];

/* ===================== UNIVERSITY CRUD ===================== */
exports.createUniversity = async (req, res) => {
  try {
    let images = DEFAULT_IMAGE;

    if (req.files?.images) {
      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];
      images = await cloudinaryService.uploadMultiple(files);
    }

    const university = await University.create({ ...req.body, images });
    res.status(201).json({ success: true, data: university });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getUniversities = async (_, res) => {
  const data = await University.find();
  res.json({ success: true, data });
};

exports.getUniversity = async (req, res) => {
  const uni = await University.findById(req.params.id);
  if (!uni) return res.status(404).json({ success: false });
  res.json({ success: true, data: uni });
};

exports.updateUniversity = async (req, res) => {
  try {
    const uni = await University.findById(req.params.id);
    if (!uni) return res.status(404).json({ success: false });

    if (req.files?.images) {
      if (uni.images.length)
        await cloudinaryService.deleteMultiple(
          uni.images.map((i) => i.public_id),
        );

      const files = Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images];
      uni.images = await cloudinaryService.uploadMultiple(files);
    }

    Object.assign(uni, req.body);
    await uni.save();

    res.json({ success: true, data: uni });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.deleteUniversity = async (req, res) => {
  const uni = await University.findById(req.params.id);
  if (!uni) return res.status(404).json({ success: false });

  if (uni.images.length)
    await cloudinaryService.deleteMultiple(uni.images.map((i) => i.public_id));

  await uni.deleteOne();
  res.json({ success: true });
};

/* ===================== BOOKING CRUD ===================== */

//     // ------------------ CREATE BOOKING ------------------

exports.createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

// exports.getBookingsByEmail = async (req, res) => {
//   try {
//     const { email } = req.params;

//     const bookings = await Booking.find({ email })
//       .sort({ createdAt: -1 });

//     if (!bookings.length) {
//       return res.status(404).json({
//         success: false,
//         message: "No bookings found for this email",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       count: bookings.length,
//       data: bookings,
//     });
//   } catch (error) {
//     console.error("Get Bookings By Email Error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch bookings",
//       error: error.message,
//     });
//   }
// };

exports.getBookingsByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const bookings = await Booking.find({ email })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error("Get Bookings Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.getBookings = async (_, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error("Get Bookings Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

exports.getBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false });
  res.json({ success: true, data: booking });
};

/* ===================== EDIT BOOKING ===================== */

exports.editBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const updates = { ...req.body };

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // 🔥 ENSURE NESTED OBJECT EXISTS
    if (!booking.booking) {
      booking.booking = {};
    }

    // ---------------- NOTES HANDLING ----------------
    if (updates.notes) {
      if (typeof updates.notes === "string") {
        updates.notes = {
          text: updates.notes,
          author: "System",
          date: new Date(),
        };
      } else if (typeof updates.notes === "object") {
        updates.notes.date = updates.notes.date || new Date();
      }
    }

    // ---------------- UPDATE NESTED BOOKING ----------------
    Object.keys(updates).forEach((key) => {
      booking.booking[key] = updates[key];
    });

    await booking.save();

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Edit Booking Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking",
      error: error.message,
    });
  }
};


exports.updateBookingStatus = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false });

  booking.booking.status = req.body.status;
  await booking.save();
  res.json({ success: true, data: booking });
};

exports.deleteBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ success: false });

  await booking.deleteOne();
  res.json({ success: true });
};

/* ===================== DASHBOARD STATS ===================== */
exports.getDashboardStats = async (_, res) => {
  const [universities, bookings, pending, confirmed, cancelled] =
    await Promise.all([
      University.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ "booking.status": "pending" }),
      Booking.countDocuments({ "booking.status": "confirmed" }),
      Booking.countDocuments({ "booking.status": "cancelled" }),
    ]);

  res.json({
    success: true,
    data: {
      universities,
      bookings,
      status: { pending, confirmed, cancelled },
    },
  });
};
