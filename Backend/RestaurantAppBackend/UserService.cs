using MongoDB.Driver;

namespace RestaurantAppBackend
{
    public class UserService
    {
        private readonly IMongoCollection<User> _userCollection;

        public UserService(IMongoDatabase database)
        {
            _userCollection = database.GetCollection<User>("Users");
        }

        // Method to find a user by GitHub ID
        public async Task<User> GetUserByIdAsync(string githubId)
        {
            return await _userCollection.Find(user => user.Id == githubId).FirstOrDefaultAsync();
        }

        // Method to create a new user
        public async Task CreateUserAsync(User user)
        {
            await _userCollection.InsertOneAsync(user);
        }
    }
}
