const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const cors = require("cors");
const jwt = require("jsonwebtoken");

router.use(cors());

router.post("/login", async (req, res) => {
  try {
    // const { error } = validate(req.body);
    // if (error) {
    //   return res.status(400).send({ message: error.details[0].message });
    // }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWTPRIVATEKEY, { expiresIn: '7d' });
    res.status(200).send({ data: token, message: "Logged in successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

// const validate = (data) => {
//   const schema = Joi.object({
//     email: Joi.string().email().required().label("Email"),
//     password: Joi.string().required().label("Password"),
//   });
//   return schema.validate(data);
// };

module.exports = router;