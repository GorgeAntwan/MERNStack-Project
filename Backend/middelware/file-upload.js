const multer = require('multer');
const uuid = require('uuid/v1');
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
  };
const fileUpload = multer({
limits:500000, //limit of the file to upload
storage:multer.diskStorage({// to define the file location and name
    destination:(req,file,cb)=>{ // to spicify location of file
        cb(null,'uploads/images');
    },
    filename:(req,file,cb)=>{ // to spicify name of file
       const ext = MIME_TYPE_MAP[file.mimetype]; // to spicify extention of file
       cb(null,uuid()+'.'+ext);//to generet uniqe name to file
    },
    
}),
fileFilter:(req,file,cb)=>{ // to validate the type of file 
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error  =isValid ?null:new Error('Invalid mime type !');
    cb(error,isValid);
}


});
module.exports= fileUpload;
