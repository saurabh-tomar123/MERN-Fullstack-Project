// const mongoose = require("mongoose");
// const AutoIncrement = require("mongoose-sequence")(mongoose);

// const tableDataSchema = new mongoose.Schema({
//   id: { type: Number, unique: true }, // Auto-increment ID
//   name: { type: String, required: true },
//   department: { type: String, required: true },
//   location: { type: String, required: true }
// }, { timestamps: true });

// // Auto-increment tableId field
// tableDataSchema.plugin(AutoIncrement, { inc_field: "id" });

// module.exports = mongoose.model("TableData", tableDataSchema);

// const mongoose = require("mongoose");

// const tableDataSchema = new mongoose.Schema({
//   id: { type: Number, required: true }, // Auto-increment per user
//   name: { type: String, required: true },
//   department: { type: String, required: true },
//   location: { type: String, required: true },
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
// }, { timestamps: true });

// module.exports = mongoose.model("TableData", tableDataSchema);
