const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const JWT_SECRET = 'Vikashisagood$oy';

router.post('/createUser',[
  body('name','Enter a valid name').isLength({min: 3}),
  body('email','Enter a vlid email').isEmail(),
  body('password','password a lest 5 characters').isLength({min: 5}),
], async (req, res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array()});
  }
  try {

 
    let user = await User.findOne({email:req.body.email});
    if (user){
      return res.status(400).json({error:"sorry a user this email already exists"})
    }
    const salt = await bcrypt.genSalt(10);

    secPass = await bcrypt.hash(req.body.password,salt);



    user = await User.create({
     name: req.body.name,
     email: req.body.email,
     password: secPass,

  });
  const data = {
    user:{
      id: user.id
    }
  }
  
  const authtoken = jwt.sign(data, JWT_SECRET);
  
 // res.json(user);
 res.json({authtoken})
} catch (error){
   console.error(error.message);
   res.status(500).send("some error occured");
}
})
module.exports = router