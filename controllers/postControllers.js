const postModel = require("../models/postModel");

//Create Post 
const createPostController = async (req, res) => {
    try {

        const { title, description } = req.body;
        // validate
        if (!title || !description) {
            return res.status(400).send({
                success: false,
                message: "Please Enter Title and Description!!",
            })
        }

        const post = await postModel({
            title,
            description,
            postedBy: req.auth._id,
        }).save();
        res.status(201).send({
            success: true,
            message: "Post Created Successfully",
            post,
        })
        // console.log(req);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Create Post API",
            error,
        });
    }
};


//Get All Posts
const getAllPostController = async (req, res) => {
    try {

        const posts = await postModel.find({}).populate('postedBy', '_id name').sort({ createdAt: -1 })
        res.status(201).send({
            success: true,
            message: "Post Fetch Successfully",
            posts,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Get all Post API",
            error,
        });
    }
}

//Get User Posts
const getUserPostController = async (req, res) => {
    try {
        const userPosts = await postModel.find({ postedBy: req.auth._id })
        res.status(201).send({
            success: true,
            message: "User Post Fetch Successfully",
            userPosts,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Get Users Post API",
            error,
        });
    }
}

//Delete 

const deletePostController = async (req, res) => {
    try {
        const { id } = req.params;
        await postModel.findByIdAndDelete({ _id: id })
        res.status(201).send({
            success: true,
            message: "Your Post has been Delete Successfully !!!",
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Delete Post API",
            error,
        });

    }
}


//UPDATE POST
const updatePostController = async (req, res) => {
    try {
        const { title, description } = req.body;
        //find post
        const post = await postModel.findById({ _id: req.params.id });

        //Validation
        if (!title || !description) {
            return res.status(400).send({
                success: false,
                message: "Please Enter Title and Description",
            })
        }

        const updatedPost = await postModel.findByIdAndUpdate({ _id: req.params.id },
            {
                title: title || post?.title,
                description: description || post?.description
            }, { new: true });
        res.status(201).send({
            success: true,
            message: "Post Updated Successfully !!!",
            updatedPost,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Update Post API",
            error,
        });
    }
}

module.exports = { createPostController, getAllPostController, getUserPostController, deletePostController, updatePostController }
