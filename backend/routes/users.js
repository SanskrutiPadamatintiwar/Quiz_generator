const router = require("express").Router();
const { User} = require("../models/user");
const bcrypt = require("bcrypt");
const cors = require("cors");
const { verify } = require("jsonwebtoken");
const verifyToken = require('../tokenmanager');
router.use(cors());

router.post("/signup", async (req, res) => {
  try {
    // const { error } = validate(req.body);
    // if (error) {
    //   return res.status(400).send({ message: error.details[0].message });
    // }
    const { username, email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).send({ message: "User already registered" });
    }
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(password, salt);

    await new User({ ...req.body, password: hashedPassword }).save();

    res.status(201).send({ message: "User created successfully",success:"true" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
});


router.get("/testing",verifyToken,async(req,res)=>{
  const user=req.user;
  res.send(user);
  // res.send("testing");
})
module.exports = router;