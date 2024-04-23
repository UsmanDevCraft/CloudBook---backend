const express = require('express');
const router = express.Router();
const User = require('../models/User');
// const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = 'usman&boy@28';


//ROUTE:1 POST REQUEST FOR CREATING A NEW USER
router.post('/createuser' , async (req, res)=>{

    //Return bad request on error
    // const errors = validationResult(req);
    const errors = null;
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    try {

    //Check whether user with this email already exists
    let user = await User.findOne({email: req.body.email})
    if(user){
      return res.status(400).json({error:"Email already exists, please try another one"})
    };

    //Generating salt and hashing password using bcryptjs
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt)

    //Create a new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });

    //Using jwt for signing data
    const data = {
      user:{
        id:user.id
      }
    };
    const authToken = jwt.sign(data , JWT_SECRET);
    success = true;

    res.json({success ,authToken})

  } catch (error){
    console.log(error.message);
    res.status(500).send("An Error Occurred");
  }
  });




  //ROUTE:2 POST METHOD FOR USER AUTHENTICATION
  router.post('/login', async (req, res)=>{

    //Return bad request on error
    // const errors = validationResult(req);
    const errors = null;
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    };

    //Destructure email and password
    const {email, password} = req.body;

    try {
      
      //user existance verification
      let user = await User.findOne({email});
      if(!user){
        return res.status(400).json({error: "Please provide the correct credentials"})
      }

      //password comparator
      const passCompare = await bcrypt.compare(password, user.password);
      if(!passCompare){
        return res.status(400).json({error: "Please provide the correct credentials"})
      }

      //Using jwt for signing data
      const data = {
        user:{
          id:user.id
        }
      };
      const authToken = jwt.sign(data , JWT_SECRET);
      success = true;
      res.json({success ,authToken})

    } catch (error){
      console.log(error.message);
      res.status(500).send("An Error Occurred");
    }
  });




  //ROUTE:3 GETTING DATA OF USER FROM AUTH TOKEN VERIFICATION
  router.post('/getuser', fetchuser, async (req, res)=>{
    try 
    {
      //getting user id from fetchuser middleware
      userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.json(user)

    } catch (error)
    {
      console.log(error.message);
      res.status(500).send("An Error Occurred");
    }
  })

module.exports = router;