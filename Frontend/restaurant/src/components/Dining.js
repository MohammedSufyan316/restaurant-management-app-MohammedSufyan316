import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dining = ({ setSelectedTable }) => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // Fetch orders on initial load
  useEffect(() => {
    fetch("http://localhost:5128/api/orders")
      .then((response) => response.json())
      .then((data) => setOrders(data));
  }, []);


  const handleTableSelection = (tableId) => {
    setSelectedTable(tableId); 
    navigate("/menu"); // Navigate to the menu page
  };

  const handlePay = async (tableId) => {
    // Find the order for the table
    const order = orders.find(order => order.tableNumber === tableId);

    if (order) {
      // Delete order from the database

      const response = await fetch(`http://localhost:5128/api/orders/${order.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setOrders(orders.filter(order => order.tableNumber !== tableId));
        alert(`Order for Table ${tableId} has been paid and removed.`);
      } else {
        alert("There was an issue processing the payment.");
      }
    } else {
      alert("No order found for this table.");
    }
  };

  return (
    <div className="container text-center my-5">
      <h2 className="mb-4">Select a Table</h2>
      <div className="row justify-content-center">
        {[1, 2, 3, 4].map((tableId) => {
          const order = orders.find(order => order.tableNumber === tableId);
          const isPending = order?.status === "Pending";
          return (
            <div className="col-6 col-md-3 mb-3" key={tableId}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Table {tableId}</h5>
                  {isPending ?
                    (<div>
                      <button className="btn btn-outline-primary w-100 mb-3" onClick={() => handleTableSelection(tableId)}> Select </button>
                      <button className="btn btn-success w-100" onClick={() => handlePay(tableId)}> Pay </button>
                      <h5 className="card-title">Total Price: ${order?.totalPrice.toFixed(2)}</h5>
                    </div>) :
                    (<button className="btn btn-outline-primary w-100 mb-3" onClick={() => handleTableSelection(tableId)}> Select </button>)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dining;
