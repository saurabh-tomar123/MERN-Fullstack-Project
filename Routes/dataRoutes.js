const express = require("express");
const Data = require("../Models/UsersData");// tableData
const UserData = require("../Models/User");// userData
const auth = require("../middleWare");

const router = express.Router();



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

module.exports = router;
