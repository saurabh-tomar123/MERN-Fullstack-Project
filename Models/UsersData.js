// models/Member.js
const mongoose = require("mongoose");
const Counter = require("./Counter");

const MemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
      maxlength: 100,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
      maxlength: 100,
    },
    id: {
      type: Number,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Auto-increment id before saving
MemberSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "id" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.id = counter.seq;
  }
  next();
});

module.exports = mongoose.models.Member || mongoose.model("Member", MemberSchema);
