using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RestaurantAppBackend
{
    public class Order
    {
        [BsonId]
        public string Id { get; set; }

        [BsonElement("status")]
        public string Status { get; set; }

        [BsonElement("tableNumber")]
        public int TableNumber { get; set; }

        [BsonElement("items")]
        public List<OrderItem> Items { get; set; } = new List<OrderItem>();

        [BsonElement("totalPrice")]
        public decimal TotalPrice { get; set; }
    }
}
