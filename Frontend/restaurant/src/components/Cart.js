import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Cart = ({ cartItems, removeItem, setCartItems, tableNumber }) => {
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!tableNumber) {
      alert("Please select a table before checking out.");
      navigate("/dining"); // Redirect to Dining page
    } else {
      // Check if there's an existing pending order for the selected table
      const existingOrderResponse = await fetch(`http://localhost:5128/api/orders/table/${tableNumber}`);
      if (existingOrderResponse.ok) {
        const existingOrder = await existingOrderResponse.json();

          // If a pending order exists, update it with new items and total price
          const updatedItems = [
            ...existingOrder.items,
            ...cartItems.map(item => ({
              menuItemId: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price
            }))
          ];
          const updatedTotalPrice = existingOrder.totalPrice + totalPrice;
          const response = await fetch(`http://localhost:5128/api/orders/${existingOrder.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              ...existingOrder,
              items: updatedItems,
              totalPrice: updatedTotalPrice
            })
          });

          if (response.ok) {
            setCartItems([]);
            alert("Your items have been added to the existing order.");
            navigate("/dining");
          } else {
            alert("There was an error updating your order. Please try again.");
          }

        } else {
          // Prepare the order data
          const order = {
            status: "Pending",
            tableNumber: tableNumber,
            items: cartItems.map(item => ({
              menuItemId: item.id,
              name: item.name,
              quantity: item.quantity,
              price: item.price
            })),
            totalPrice: totalPrice
          };

          // Send order data to the backend API
          const response = await fetch("http://localhost:5128/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(order)
          });

          if (response.ok) {
            // Clear cart state on successful order creation
            setCartItems([]);
            alert("Thank you for your purchase! Your order has been placed.");
            navigate("/dining");
          } else {
            alert("There was an error placing your order. Please try again.");
          }
        }
      }
  };

  return (
    <div className="container">
      <h2 className="text-center my-4">Your Cart</h2>
      {cartItems.length > 0 ? (
        <div className="row">
          {cartItems.map((item) => (
            <div className="col-md-6 mb-4" key={item.id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">{item.description}</p>
                  <p className="card-text">Price: ${item.price}</p>
                  <p className="card-text">Quantity: {item.quantity}</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No items in the cart.</p>
      )}
      <div className="text-center my-4">
        <h3>Total: ${totalPrice.toFixed(2)}</h3>
        {cartItems.length > 0 && (
          <button className="btn btn-success" onClick={handleCheckout}>
            Place Order
          </button>
        )}
      </div>
    </div>
  );

};


export default Cart;
