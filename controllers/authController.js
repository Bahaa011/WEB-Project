// controllers/authController.js
const authService = require(`../services/authServices`);

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
        try{
            const {username, email, password} = req.body;

            const newUser = await authService.register({username, email, password});
            res.status(201).json({message: 'User registered successfully.',
                user: newUser
            });
        } catch(error) {
            res.status(500).json({message: 'Internal server error'});
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