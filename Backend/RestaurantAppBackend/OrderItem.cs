using MongoDB.Bson.Serialization.Attributes;

namespace RestaurantAppBackend
{
    public class OrderItem
    {
        [BsonElement("menuItemId")]
        public string MenuItemId { get; set; }

        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("quantity")]
        public int Quantity { get; set; }

        [BsonElement("price")]
        public decimal Price { get; set; }
    }
}
