using MongoDB.Bson;
using MongoDB.Driver;

namespace RestaurantAppBackend
{
    public class OrderService
    {
        private readonly IMongoCollection<Order> _orders;

        public OrderService(IMongoCollection<Order> orders)
        {
            _orders = orders;
        }

        public async Task<List<Order>> GetAllOrders() =>
            await _orders.Find(order => true).ToListAsync();

        public async Task<Order> GetOrderById(string id)
        {
            return await _orders.Find(order => order.Id == id).FirstOrDefaultAsync();

        }

        public async Task CreateOrder(Order order)
        {
            order.Id = Guid.NewGuid().ToString();  
            await _orders.InsertOneAsync(order);
        }

        public async Task<bool> UpdateOrder(string id, Order updatedOrder)
        {
            var result = await _orders.ReplaceOneAsync(order => order.Id == id, updatedOrder);
            return result.IsAcknowledged;
          
        }

        public async Task<bool> DeleteOrder(string id)
        {
            var result = await _orders.DeleteOneAsync(order => order.Id == id);
            return result.IsAcknowledged;

        }

        public async Task<Order?> GetPendingOrderByTableNumber(int tableNumber)
        {
            return await _orders.Find(order => order.TableNumber == tableNumber && order.Status == "Pending").FirstOrDefaultAsync();
        }

    }
}
