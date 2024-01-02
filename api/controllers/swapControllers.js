// Ensure the function is defined and exported correctly.
const SwapRequest = require("../models/SwapRequest");
const User = require("../models/User");
 
const { ObjectId } = require('mongoose').Types; // Import ObjectId


const getswapAllcourse = async (req, res) => {
    try {
        const swaps = await SwapRequest.find({});
        res.status(200).json(swaps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
 
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET; // Use the secret key from your environment variables

const addSwapRequest = async (req, res) => {
    try {
        // Extract the token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1]; // Assuming the token is sent as "Bearer <token>"
        // console.log(token);
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        // Verify and decode the token
        const decoded = jwt.verify(token, SECRET_KEY);
        const userEmail = decoded.email; // Use the email from the decoded token
        console.log(decoded)
        // Find the existing user by email
        const existingUser = await User.findOne({ email: decoded.email }); // Use userEmail
        console.log(existingUser)
        if (!existingUser) {
            return res.status(404).json({ message: "User not found!" });
        }
        
        // Log the User ID
        console.log("User email:", userEmail);

        // Extract swap request details from the request body
        const { semester, dealerCourse, dealerSection, interestedCourse, interestedSections, isAvailable, reward } = req.body;

        // Create a new SwapRequest document
        const newSwapRequest = new SwapRequest({
            user: userEmail, // Link the swap request with the user
            semester,
            dealerCourse,
            dealerSection,
            interestedCourse,
            interestedSections,
            isAvailable,
            reward
        });

        // Save the new SwapRequest
        await newSwapRequest.save();

        res.status(201).json({ message: 'Swap request added successfully', swapRequest: newSwapRequest });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            // If the error is because of the JWT
            return res.status(401).json({ message: "Invalid Token" });
        }
        res.status(500).json({ message: error.message });
    }
};


const editSwapRequest = async (req, res) => {
    try {
        const { id } = req.params; // Get the ID of the swap request to edit
        const { semester, dealerCourse, dealerSection, interestedCourse, interestedSections, isAvailable, reward } = req.body;

        // Find the swap request by ID
        const swapRequest = await SwapRequest.findById(id);

        if (!swapRequest) {
            return res.status(404).json({ message: 'Swap request not found' });
        }

        // Update the swap request fields
        swapRequest.semester = semester;
        swapRequest.dealerCourse = dealerCourse;
        swapRequest.dealerSection = dealerSection;
        swapRequest.interestedCourse = interestedCourse;
        swapRequest.interestedSections = interestedSections;
        swapRequest.isAvailable = isAvailable;
        swapRequest.reward = reward;

        // Save the updated swap request
        await swapRequest.save();

        res.status(200).json({ message: 'Swap request updated successfully', swapRequest });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSwapRequest = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate the ID format (if you're using MongoDB)
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid swap request ID' });
        }

        const deletedSwapRequest = await SwapRequest.findByIdAndDelete(id);

        if (!deletedSwapRequest) {
            return res.status(404).json({ message: 'Swap request not found' });
        }

        res.status(200).json({ message: 'Swap request deleted successfully', deletedSwapRequest });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSwapCoursesByUseremail = async (req, res) => {
    try {
        const userId = req.params.email; // Get email from route parameters
        const swaps = await SwapRequest.find({ user: userId }); // Use userId to filter swap requests
        res.status(200).json(swaps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getswapAllcourse,
    addSwapRequest,
    editSwapRequest,
    deleteSwapRequest, // Add the deleteSwapRequest function to exports
    getSwapCoursesByUseremail,
};