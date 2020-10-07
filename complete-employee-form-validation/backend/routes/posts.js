const express = require("express");
const multer = require("multer");

const Post = require("../models/post");
const moment = require('moment')

const router = express.Router();
const fs = require("fs");


const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post(
  "",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {

    //var newDate = moment(req.body.birthdate).format('YYYY-MM-DD')

    moment.createFromInputFallback = function(config) {
      // unreliable string magic, or
      config._d = new Date(config._i);
    };
    var newDate = moment(req.body.birthdate).format('YYYY-MM-DD');

    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      name: req.body.name,
      email: req.body.email,
      birthdate: newDate,
      imagePath: url + "/images/" + req.file.filename,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address

    });

    //console.log(req.body, "Inside Routes at 47 line");

    post.save().then(createdPost => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id
        }
      });
    });
  }
);

router.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename
    }

    console.log("req.body", req.body);
    console.log("req.file", req.file);
    var newDate = moment(req.body.birthdate).format('YYYY-MM-DD')

    const post = new Post({

      _id: req.body.id,
      name: req.body.name,
      email: req.body.email,
      birthdate: newDate,
      imagePath: imagePath,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address

    });

    //console.log(req.body.id, req.body.name, req.body.email, req.body.birthdate, imagePath);

    //console.log("inside backend routes line 75", post);

    Post.updateOne({ _id: req.params.id }, post).then(result => {
      res.status(200).json({ message: "Update successful!" });
    });
  }
);

router.get("", (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: documents
    });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "Post not found!" });
    }
  });
});

router.delete("/:id", (req, res, next) => {

  // const postData = Post.findOne({ _id: req.params.id });
  // const imageName = postData.imagePath;
  //console.log("FindOne>>>>>>>>>>>>>>>>>>",Post.findOne({_id: req.params.id}).findOne(imageName));
 // find Post who is going to be deleted, selecting the 'imagePath' field

 var imageFileName = undefined;
 var path = undefined;


Post.find({ _id: req.params.id }, 'imagePath', function (err, dataBase) {
  if (err) return handleError(err);


console.log(dataBase[0].imagePath);
imageFileName = dataBase[0].imagePath.substr(29, );

path = "C:/Users/sujit/Desktop/Angular pratice/DAY3-4 employee form data/complete-employee-form-validation/backend/backend/images/"+ imageFileName;
console.log(path,"path>>>>>>>");

  try {
    fs.unlinkSync(path);
    //file removed
  } catch (err) {
    console.error(err);
  }

})

  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log("inside routes backend line 118 ", result);
    res.status(200).json({ message: "Post deleted!" });
  });


});

module.exports = router;
