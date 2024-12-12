class UserService {
    constructor() {
        this.pool = null;
        this.init();
    }

    async init() {
        this.pool = await initDB();
    }

    /**
     * Retrieves all games associated with a user.
     * @async
     * @param {number} userId - The ID of the user.
     * @returns {Array} An array of Game objects associated with the user.
     * @throws {Error} If there is an error querying the database.
     */
    async getUserGames(userId) {
        try {
            const [rows] = await this.pool.query(
                `SELECT games.game_id, games.name, games.genre, games.release_date
                 FROM games
                 INNER JOIN user_games ON games.game_id = user_games.game_id
                 WHERE user_games.user_id = ?`, [userId]
            );
            return rows; // Return the game data for the user
        } catch (error) {
            throw new Error('Error retrieving user games: ' + error.message);
        }
    }

    // ... other methods (getAllUsers, createUser, updateUser, etc.)
}
