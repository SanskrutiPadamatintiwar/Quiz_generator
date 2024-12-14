const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const cors = require("cors");
const verifyToken = require('../tokenmanager');
router.use(cors());
const dotenv = require("dotenv");
dotenv.config();

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).send({ message: "User already registered" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    await new User({ ...req.body, password: hashedPassword }).save();

    res.status(201).send({ message: "User created successfully", success: "true" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});

router.get("/testing", verifyToken, async (req, res) => {
  const user = req.user;
  res.send(user);
});

module.exports = router;