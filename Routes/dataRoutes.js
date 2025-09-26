const express = require("express");
const Data = require("../Models/UsersData");// tableData
const UserData = require("../Models/User");// userData
const auth = require("../middleWare");
const nodemailer = require("nodemailer");

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});



// Create Data
router.post("/members", auth, async (req, res) => {
  try {

const {name, department, location}  = req.body
    const newData = new Data({
      name,
      department,
      location,
    });
    
    await newData.save();
    res.json(newData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get User's Own Data
router.get("/members", async (req, res) => {
  try {
    const data = await Data.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/users", async (req, res) => {
  try {
    const data = await UserData.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete User's Data
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Data.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ message: "Data not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a document by custom id
router.put("/:id", async (req, res) => {
  try {
    const updated = await Data.findOneAndUpdate(
      { id: req.params.id },       // search by custom id
      req.body,                    // update fields from request body
      { new: true, runValidators: true } // return updated doc & validate
    );

    if (!updated) return res.status(404).json({ message: "Data not found" });

    res.json({ message: "Updated successfully", data: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function sendOTP(email, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}. It will expire in 5 minutes.`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return true;
  } catch (err) {
    console.error("Error sending email:", err);
    return false;
  }
} 
router.post("/send-otp", async (req, res) => {
  const { emialId } = req.body;
  console.log(req.body)

  if (!emialId) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Send OTP via email
  const sent = await sendOTP(emialId, otp);

  if (sent) {
    // Ideally, store OTP in DB or cache with expiry time for verification
    res.json({ success: true, otp, message: "OTP sent successfully" });
  } else {
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

module.exports = router;
