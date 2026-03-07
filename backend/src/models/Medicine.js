const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    composition: String,
});

module.exports = mongoose.model("Medicine", medicineSchema);
