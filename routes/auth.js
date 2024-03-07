const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');




const JWT_SECRET = 'Vikashisagoodboy';

router.post('/login', [

  body('email', 'Enter a vlid email').isEmail(),
  body('password', 'password a lest 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {


    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "sorry a user this email already exists" })
    }
    const salt = await bcrypt.genSalt(10);

    secPass = await bcrypt.hash(req.body.password, salt);



    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,

    });
    const data = {
      user: {
        id: user.id
      }
    }

    const authtoken = jwt.sign(data, JWT_SECRET);

    // res.json(user);
    res.json({ authtoken })
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
})

router.post('/login', [

  body('email', 'Enter a vlid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),

], async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "please try to  login with correct credentials" });

    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).json({ error: "please try to correct credentials" });

    }
    const data = {
      user: {
        id: user.id
      }
    }

    const authtoken = jwt.sign(data, JWT_SECRET);
    res.json({ authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }

})
router.post('/getuser', fetchuser, async (req, res) => {



  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
  }
})

module.exports = router