import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Menu = ({ addToCart }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [quantities, setQuantities] = useState({}); 
  const navigate = useNavigate();
  
  useEffect(() => {
    fetch("http://localhost:5128/api/menu") 
      .then((response) => response.json())
      .then((data) => setMenuItems(data));
  }, []);

  const handleQuantityChange = (itemId, change) => {
    setQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[itemId] || 0;
      const newQuantity = Math.max(0, currentQuantity + change); // Prevent negative quantities
      const updatedQuantities = { ...prevQuantities, [itemId]: newQuantity };
      return updatedQuantities;
      });
    };

  const handleOrder = () => {
    const itemsToAdd = menuItems.filter(item => quantities[item.id] > 0).map(item => ({
      ...item,
      quantity: quantities[item.id]
    }));
    addToCart(itemsToAdd); 
    navigate("/cart"); // Redirect to Cart page
  };

  return (
    <div className="container">
      <h1 className="text-center my-4">Menu</h1>
      <div className="row">
        {menuItems.map((item) => (
          <div className="col-md-4 mb-4" key={item.id}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">{item.description}</p>
                <p className="card-text font-weight-bold">Price: ${item.price}</p>
                <div className="d-flex align-items-center justify-content-between">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleQuantityChange(item.id, -1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantities[item.id] || 0}
                    readOnly
                    className="form-control text-center mx-2"
                    style={{ width: "50px" }}
                  />
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center my-4">
        <button className="btn btn-primary" onClick={handleOrder}>
          Order
        </button>
      </div>
    </div>
  );
};

export default Menu;
