const jwt = require("jsonwebtoken");
const HttpError = require("../models/http-error");

module.exports=(req,res,next)=>{
    if(req.method ==='OPTIONS'){
      return next();
    }
   try {
    const token = req.headers.authorization.split(' ')[1];//Authorization : Bearer token
    if(!token){
        throw new Error('Authentication faild.');
    }
    const  decodeToken = jwt.verify(token,process.env.JWT_KEY);
    req.userDate = {userId:decodeToken.userId} ;
    next();
   } catch (err) {
       const error = new HttpError('Authentication faild',401);
       return next(error);
   }

}