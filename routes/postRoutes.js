const express = require('express');
const { requireSignIn } = require('../controllers/userController');
const { createPostController, getAllPostController, getUserPostController, deletePostController, updatePostController } = require('../controllers/postControllers');

// router object
const router = express.Router();

//Routes
//Create Post || POST
router.post('/create-post', requireSignIn, createPostController);

//Get All Posts || GET
router.get('/get-all-post', getAllPostController);

//Get All User || GET
router.get('/get-user-post', requireSignIn, getUserPostController);

//Delete Post
router.delete('/delete-post/:id', requireSignIn, deletePostController);

//Update Post
router.put('/update-post/:id', requireSignIn, updatePostController);

//Export
module.exports = router;