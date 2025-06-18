namespace RestaurantAppBackend;

using MongoDB.Driver;

public class MenuItemService
{
        private readonly IMongoCollection<MenuItem> _menuItems;

        public MenuItemService(IMongoCollection<MenuItem> menuItems)
        {
            _menuItems = menuItems;
        }

    public Task<List<MenuItem>> GetAllItems() =>
        _menuItems.Find(_ => true).ToListAsync();

    public Task<MenuItem> GetItemById(string id) =>
        _menuItems.Find(menu => menu.Id == id).FirstOrDefaultAsync();

    public Task CreateItem(MenuItem menuItem) =>
        _menuItems.InsertOneAsync(menuItem);

    public async Task<bool> UpdateItem(string id, MenuItem menuItem) =>
        (await _menuItems.ReplaceOneAsync(menu => menu.Id == id, menuItem)).ModifiedCount > 0;

    public async Task<bool> DeleteItem(string id) =>
        (await _menuItems.DeleteOneAsync(menu => menu.Id == id)).DeletedCount > 0;
}
