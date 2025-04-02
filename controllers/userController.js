const JWT = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../helpers/authHelper');
const userModel = require('../models/userModel');
const { expressjwt: jwt } = require('express-jwt');

//middleware 
const requireSignIn = jwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"], })

//Register Controller
const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        //Validation 
        if (!name) {
            return res.status(400).send({
                success: false,
                message: 'name is Required',

            })
        }
        if (!email) {
            return res.status(400).send({
                success: false,
                message: 'email is Required',

            })
        }
        if (!password || password.length < 6) {
            return res.status(400).send({
                success: false,
                message: 'password is Required minimun 6 characters',

            })
        }

        // Existing User
        const existingUser = await userModel.findOne({ email: email })
        if (existingUser) {
            return res.status(500).send({
                success: false,
                message: 'User Already Exist !! '
            })
        }

        //hased Password
        const hashedPassword = await hashPassword(password);

        //Insert User to Database
        const user = await userModel({ name, email, password: hashedPassword, }).save();

        return res.status(201).send({
            success: true,
            message: 'Registration Successfull Please Login..'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Registration !!! ',
            error: error,
        })
    }

};


//Login Controller
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //Validation 
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: 'Please Provide Email or Password',

            })
        }
        // Find User
        const findUser = await userModel.findOne({ email: email })
        if (!findUser) {
            return res.status(500).send({
                success: false,
                message: 'User Not Found !! '
            })
        }

        //Match Password
        const match = await comparePassword(password, findUser.password);
        if (!match) {
            return res.status(500).send({
                success: false,
                message: 'Incorrect username or password',
            })
        }

        //TOKEN JWT
        const token = await JWT.sign({ _id: findUser._id }, process.env.JWT_SECRET, { expiresIn: "7d", });

        //undefind Password
        findUser.password = undefined;

        return res.status(201).send({
            success: true,
            message: 'Login Successfull...',
            token,
            findUser,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in Login !!! ',
            error: error,
        })
    }

};

//get user
const getUserController = async (req, res) => {
    try {
        //find user
        const findUser = await userModel.find({})
        res.status(201).send({
            success: true,
            message: 'Data Get Successfully',
            findUser,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in User Get API !!! ',
            error,
        })

    }

}

//Update User Controller 
const updateUserController = async (req, res) => {
    try {
        const { name, password, email } = req.body;
        //find user
        const findUser = await userModel.findOne({ email: email })

        //password Validation
        if (password && password.length < 6) {
            return res.status(400).send({
                success: false,
                message: 'Password is required and should be more than 6 character !!! ',
                error: error,
            })
        }

        const hashedPassword = password ? await hashPassword(password) : undefined;

        // Updated User
        const updatedUser = await userModel.findOneAndUpdate({ email }, {
            name: name || findUser.name,
            password: hashedPassword || findUser.password
        }, { new: true });
        updatedUser.password = undefined;
        res.status(201).send({
            success: true,
            message: 'Profile Updated Successfully Please Login',
            updatedUser,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in User Update API !!! ',
            error,
        })

    }

}

module.exports = { registerController, loginController, updateUserController, requireSignIn, getUserController }