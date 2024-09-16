const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  group_id: String,
  image: Buffer, // Store image data as a Buffer
});

module.exports = mongoose.model("Image", ImageSchema);
