// controllers/userController.js
const userService = require('../services/userService');
const bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);
const cookie = require("cookie-parser");

/**
 * Controller class for handling user-related HTTP requests.
 * Provides methods for retrieving, creating, updating, and deleting users.
 * @class
 */
class UserController {
    /**
     * Handles the request for getting all users.
     * @async
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Object} JSON response containing the list of all users.
     */
    async getAllUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request that gets a user by their ID.
     * @async
     * @param {Object} req - The request object containing user ID.
     * @param {Object} res - The response object containing the requested user.
     * @returns {Object} JSON response containing the user details.
     */
    async getUserById(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const user = await userService.getUserById(id);

            res.json(user);
        } catch (error) {
            if(error.message.includes('User not found')){
                return res.status(404).json({message: error.message}); // send descriptive errors
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for searching users by a search term.
     * @async
     * @param {Object} req - The request object containing search query.
     * @param {Object} res - The response object containing search results.
     * @returns {Object} JSON response containing the list of users matching the search term.
     */
    async searchUser(req, res){
        try{
            const { query: searchTerm } = req.query; // extract the search term after ?

            const users = await userService.searchUser({ searchTerm });

            if (users.length === 0) {
                return res.render('user', { users, message: 'No users found' });
            }

            return res.render('user', { users });
        } catch(error){
            if(error.message.includes('No users found')){
                return res.status(404).json({message: error.message});
            }
            res.status(500).json({message: 'Internal server error'});
        }
    }

    /**
     * Handles the request of creating a new user.
     * @async
     * @function
     * @param {Object} req - The request object containing user data.
     * @param {Object} res - The response object containing the newly created user.
     * @returns {Object} JSON response containing the created user's details.
     */
    async createUser(req, res) {
        try {
            const { username, email, password, profile_picture, bio } = req.body;

            console.log(username)
            console.log(email)
            console.log(password)

            const newUser = await userService.createUser({ username, email, password, profile_picture, bio });
            res.status(201).json(newUser);
        } catch (error) {
            if(error.message.includes(`Account with this`)){
                return res.status(409).json({message: error.message});
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    async login(req, res) {
        try {
          const { username : username, password } = req.body;
          const [user] = await userService.searchUser({username});

            console.log(user)

          if (user.length === 0) {
            return res.redirect("/login?error=invalid");
          }
          
          console.log(password)
          console.log(user)

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return res.redirect("/login?error=invalid");
          }
      
          // Generate token
          const payload = {
            user: {
              id: user.userId,
              username: user.username,
            },
          };
      
          jwt.sign(
            payload,
            'mySecretKey',
            { expiresIn: "1h" }, 
            (err, token) => {
              if (err) throw err;
      
             
              res.cookie("token", token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === "production", 
                maxAge: 3600000, //  (1 hour)
              });
      
              res.redirect("/games");
            }
          );
        } catch (error) {
          res.status(500).json({ message: error?.message });
        }
    }

    /**
     * Handles the request for updating an existing user.
     * @async
     * @function
     * @param {Object} req - The request object containing user ID and update data.
     * @param {Object} res - The response object containing a success message.
     * @returns {Object} JSON response indicating the success or failure of the update operation.
     */
    async updateUser(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const { username, email, password, profile_picture, bio } = req.body;

            // check if there are fields to update
            if (!username && !email && !password && !profile_picture && !bio) {
                return res.status(400).json({ message: 'No fields to update' });
            }
            const success = await userService.updateUser(id, { username, email, password, profile_picture, bio });
            if (!success) {
                return res.status(404).json({ message: 'User not found or no changes made' });
            }
            res.json({ message: 'User updated successfully' });
        } catch (error) {
            if(error.message.includes(`already exists`)){
                return res.status(409).json({message: error.message}); // handle descriptive errors
            }
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * Handles the request for deleting a user.
     * @async
     * @function
     * @param {Object} req - The request object containing user ID to be deleted.
     * @param {Object} res - The response object containing a success message.
     * @returns {Object} JSON response indicating the success or failure of the delete operation.
     */
    async deleteUser(req, res) {
        try {
            const id = parseInt(req.params.id, 10);
            const success = await userService.deleteUser(id);
            if (!success) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ message: 'User deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new UserController();
