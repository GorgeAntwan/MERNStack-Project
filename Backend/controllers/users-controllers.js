const { validationResult } = require('express-validator');
const HttpError = require('../models/http-error');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getUsers = async(req, res, next) => {
 
 let users;
 try {
   users =await User.find({},"-password");
   } catch (err) {
   const error = new HttpError("can catch all user",500);
   return next(error);
 }
 return res.json({users:users.map(user=>user.toObject({getters:true}))});

};

const signup =async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return (new HttpError('Invalid inputs passed, please check your data.', 422));
  }
  const { name, email, password } = req.body;

  
  let existUser;
  try {
     existUser =await User.findOne({email:email});
  } catch (err) {
    console.log(err);
    const error = new HttpError("can not sinup try again latter",500)
    return next(error);
  }
  if(existUser){
    const error = new HttpError("email already exist try login instead",422)
    return next(error);
  }
  let hashedPassword ;
  try {
    hashedPassword = await bcrypt.hash(password,12)
  } catch (err) {
    const error = new HttpError('could not create user please try again',500);
    return next(error);
  }
  let createdUser;
  try {
    createdUser=   new User({
      name,
      email,
      password:hashedPassword ,
      image: req.file.path,
      places:[]
    });
  } catch (err) {
    const error = new HttpError("can not sinup try again latter",500)
    return next(error);
  }
  try {
   await createdUser.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError("can not signup try again latterr",500)
    return next(error);
  }
  
  let token;
   
 try {

  token = await jwt.sign({userId:createdUser.id,email:createdUser.email},
    process.env.JWT_KEY,{expiresIn:'1h'});
   
 } catch (err) {
  console.log(err);
  const error = new HttpError("can not signup try again latterr",500)
  return next(error);
 }
   

  res.status(201).json({userId:createdUser.id,email:createdUser.email,token:token});
};

const login = async(req, res, next) => {
  const { email, password } = req.body;

  
  let existUser;
  try {
     existUser =await User.findOne({email:email});
  } catch (err) {
    console.log(err);
    const error = new HttpError("can not login try again latter",500)
    return next(error);
  }

  console.log(existUser);
  if(!existUser){
    const error = new HttpError("plase check your email or password  ",422);
    return next(error);
  }
  let isValidPassword = false;
  try {
   
    isValidPassword = await bcrypt.compare(password,existUser.password);
  } catch (err) {
    const error = new HttpError('colud not log you in ,place check your credentail and try again ',500);
    return next(error);
  }
  if(!isValidPassword){
    const error = new HttpError('invalid credentails could not log you in.',403);
    return next(error);
  }

  
  let token;
   
 try {
  
  token = await jwt.sign({userId:existUser.id,email:existUser.email},
    process.env.JWT_KEY,{expiresIn:'1h'});
   
 } catch (err) {
  console.log(err);
  const error = new HttpError("can not lig in try again latterr",500)
  return next(error);
 }
  
 console.log({userId:existUser.id,email:existUser.email,token:token});
  res.json({userId:existUser.id,email:existUser.email,token:token});
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
