const { validationResult } = require('express-validator');
const Place =require('../models/place');
const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const place = require('../models/place');
const mongoose = require('mongoose');
const User = require('../models/user');
const fs = require('fs');


const getPlaceById =async (req, res, next) => {
  const placeId = req.params.pid;  
   
  let place;
  try {
      place = await Place.findById(placeId);
  } catch (err) {
     const error = new HttpError(
       'some thing wrong can not get place by id',500);
      return next(error);
  }
  
  if (!place) {
    const error = new HttpError('Could not find a place for the provided id.', 404);
    return next(error);
  }

  res.json({ place:place.toObject({getters:true}) }); 
};

 

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

   
  let userPlaces;
  try {
    userPlaces =await User.findById(userId).populate('places');
  } catch (err) {
        console.log(err);
        const error = new HttpError('could not find place by user id ');
        return next(error);
  }
  console.log(userPlaces.places);
  if (!userPlaces || userPlaces.places.length === 0) {
    return next(
      new HttpError('Could not find places for the provided user id.', 404)
    );
  }

  res.json({ places:userPlaces.places.map(place=>place.toObject({getters:true})) });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, address } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
     
  } catch (error) {
    return next(error);
  }

  
  const createdPlace =new Place ({
    
    title,
    description,
    image:req.file.path,
    location: coordinates,
    address,
    creator:req.userDate.userId
  });
  let user;
  try {
     user =await User.findById(req.userDate.userId);
  } catch (err) {
    console.log(err);
    const error =new HttpError("creat place faild place try again ",500);
    return next(error);
  }
  console.log(user);
  if(!user){
    const error =new HttpError("can not find user ",500);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({session:sess});
    user.places.push(createdPlace);
    await user.save({session:sess});
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('failed to create Places',500);
    return next(error);
  }
   

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

   

   let place;
   try {
       
        place =await Place.findById(placeId);
        

   } catch (err) {
      
     const error =new HttpError("can not update places",500);
     return next(error);
   }
   if(place.creator.toString()!==req.userDate.userId){
    const error =new HttpError("you not allow to edite place",401);
    return next(error);
   }
   place.title =title;
   place.description =description;
   try {
     await place.save();
   } catch (err) {
     const error = new HttpError('Some thing wrong can not update place',500);
     return next(error)
   }
   res.status(200).json({ place: place.toObject({getters:true}) });
};

const deletePlace =async (req, res, next) => {
  const placeId = req.params.pid;
  
  let place;
  try {
    place = await  Place.findById(placeId).populate('creator');//to find places with own user
  } catch (err) {
     console.log(err);
     const error = new HttpError("can not find place",500);
     return next(error);
  }
  if(place.creator.id.toString()!==req.userDate.userId){
    const error =new HttpError("you not allow to delete place",401);
    return next(error);
   }
  console.log(place);
  console.log(place.creator.places);
  imagePath = place.image;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
     await place.remove({session:sess});//to remove from places document
       place.creator.places.pull(place);//to remove from user.places document
     await place.creator.save({session:sess});
     await sess.commitTransaction();

  } catch (err) {
    console.log(err);
    const error = new HttpError("some thing went wrong to remove place",500);
    return next(error);
  }
  fs.unlink(imagePath,err =>{
    console.log(err);
  })
  res.status(200).json({ message: 'Deleted place.' });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
