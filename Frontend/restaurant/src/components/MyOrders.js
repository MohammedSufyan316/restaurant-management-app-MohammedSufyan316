import React, { useEffect, useState } from "react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("http://localhost:5128/api/orders");
        if (response.ok) {
          const ordersData = await response.json();
          setOrders(ordersData);
        } else {
          alert("Failed to fetch orders.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p>Loading orders...</p>;
  }

  return (
    <div className="container">
      <h2 className="text-center my-4">My Orders</h2>
      {orders.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Table Number</th>
              <th>Status</th>
              <th>Total Price</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.tableNumber}</td>
                <td>{order.status}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.name} (x{item.quantity}) - ${item.price.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">You have no orders.</p>
      )}
    </div>
  );
};

export default MyOrders;
