const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const multer = require("multer");

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads");
//   },
//   filename: function (req, file, cb) {
//     const time = Date.now();
//     cb(null, time + file.originalname);
//   },
// });

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const Image = require("./models/Image");
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    console.log(req.file);
    // Create a new image instance
    const newImage = new Image({
      group_id: req.body.group_id, // Assuming group_id is sent in the request body
      image: req.file.buffer, // Store the image buffer
    });
    // Save the image to MongoDB
    const savedImage = await newImage.save();
    res.json(savedImage);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Define the route to get all images as data URLs
app.get("/api/images", async (req, res) => {
  try {
    // Query MongoDB to get all images
    const images = await Image.find({});
    const imageDataUrls = images.map((image) => {
      if (image && image.image && image.mimetype) {
        return {
          _id: image._id,
          dataUrl: `data:${image.mimetype};base64,${image.image.toString(
            "base64"
          )}`,
          originalname: image.originalname,
        };
      }
      return null; // Handle undefined or missing properties
    });
    res.json(imageDataUrls.filter((image) => image !== null)); // Remove null entries
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

const server = http.createServer(app);

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const friendRequestsRoutes = require("./routes/friendRequestsRoutes");
const requestsRoutes = require("./routes/requestsRoutes");
const chatRoutes = require("./routes/chatsRoutes");
const groupRoutes = require("./routes/groupRoutes");
const communityRoutes = require("./routes/communityRoutes");

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/friend-request", friendRequestsRoutes);
app.use("/request", requestsRoutes);
app.use("/groups", groupRoutes);
app.use("/community", communityRoutes);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get('/', async (req, res)=> {
  res.status(200).send("test")
})

require("./consumer")(io);

module.exports = io;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });

server.listen(process.env.PORT || 5000, () => {
  console.log("Server running on PORT", process.env.PORT || 5000);
});
