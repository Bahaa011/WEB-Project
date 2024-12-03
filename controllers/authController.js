// controllers/authController.js
const authService = require(`../services/authServices`);
const User = require('../models/userModel');

/**
 * Controller class for handling authentication requests.
 * Provides methods for user registration and login.
 * @class
 */
class AuthController{
    /**
     * Handles the request for registering a new user.
     * @async
     * @param {Object} req - The request object containing user registration data (username, email, password).
     * @param {Object} res - The response object containing the registration result.
     * @returns {Object} JSON response indicating successful user registration.
     */
    async register(req, res){
        try {
            // Process registration
            const { username, email, password } = req.body;
        
            // Example: Check if the username already exists (you can use your DB query here)
            const userExists = await User.findOne({ username: username });
        
            if (userExists) {
              // If username exists, send a message
              res.render('register', { message: 'Username already taken. Please choose another one.' });
            } else {
              // Register the user (you can add your registration logic here)
              const newUser = await authService.register({username, email, password});
              // If registration is successful
              res.render('register', { message: 'Registration successful! Please log in.' });
            }
          } catch (error) {
            // Handle errors and send generic error message
            console.error('Error during registration:', error);
            res.render('register', { message: 'An error occurred. Please try again later.' });
          }
    }

    /**
     * Handles the request for logging in a user.
     * @async
     * @param {Object} req - The request object containing user login credentials (email, password).
     * @param {Object} res - The response object containing the login result (token).
     * @returns {Object} JSON response with the login result (token) on successful login, or an error message on failure.
     */
    async login(req, res){
        try{
            const {email, password} = req.body;
            const token = await authService.login({email, password});

            res.status(200).json({message:'Login Successful', Token : token});
        } catch(error){
            res.status(401).json({message: 'Invalid credentials'});
        }
    }
}

module.exports = new AuthController();