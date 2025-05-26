using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace RestaurantAppBackend
{
    public class MenuItem
    {
        [BsonId]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("price")]
        public decimal Price { get; set; }

        [BsonElement("description")]
        public string Description { get; set; }
    }
}
