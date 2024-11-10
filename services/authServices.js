// services/authService.js
const { initDB } =  require(`../config/database`);
const bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);
const dotenv = require(`dotenv`);

dotenv.config();

class AuthService{
    /**
     * Initializes a new instance of the recordService class.
     * @constructor
     */
    constructor(){
        this.pool = null;
        this.init();
    }

    /**
     * Initialize the database connection pool.
     * @async
     */
    async init(){
        this.pool = await initDB();
    }

    /**
     * Register a new user in the system.
     * @async
     * @param {Object} userData - The user data for registration
     * @param {string} userData.username - The username of the user
     * @param {string} userData.email - The email of the user
     * @param {string} userData.password - The password of the user
     * @returns {Object} The created user details
     * @throws {Error} Throws error if email or username already exists or if database query fails
     */
    async register(userData){
        try{
            const {username, email, password} = userData;
            const hashedPassword = await bcrypt.hash(password, 12);

            const [checkIfExists] = await this.pool.query
                (`SELECT * FROM users WHERE email = ? OR username = ?`,[email, username]);
            if(checkIfExists.length > 0){
                throw new Error(`Account with this email or username already exists. Try logging in`);
            }

            const [result] = await this.pool.query
                (`INSERT INTO users(username, email, password) 
                    VALUES (?,?,?)`,[username, email, hashedPassword]);
            
            const [createdUser] = await this.pool.query
                    (`SELECT user_id AS id, username, email, password, profile_picture_url, bio, created_at, updated_at 
                        FROM users WHERE user_id = ?`,
                        [result.insertId]);
            return createdUser[0];
        } catch(error){
            throw new Error(error);
        }
    }

    /**
     * Log in an existing user by verifying email and password.
     * @async
     * @param {Object} userData - The user data for login
     * @param {string} userData.email - The email of the user
     * @param {string} userData.password - The password of the user
     * @returns {Object} An object containing the JWT token and user details
     * @throws {Error} Throws error if email or password is invalid or if database query fails
     */
    async login(userData){
        const {email, password} = userData;

        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        try{
            const [result] = await this.pool.query(`SELECT * FROM users WHERE email = ?`,[email]);

            if (result.length === 0) {
                throw new Error('Invalid credentials');
            }
            const user = result[0];
            const check = await bcrypt.compare(password, user.password);   
            if(!check){
                throw new Error(`Invalid password`);
            }

            const token = jwt.sign( 
                { userId: user.user_id,
                    email: user.email }, 
                    process.env.JWT_SECRET_KEY, 
                    { expiresIn: '1h' });
            
            return {token, 
                user: 
                {id: user.user_id,
                 email: user.email,
                  username: user.username}};

        } catch(error){
            throw new Error(error);
        }
    }
}

module.exports = new AuthService();