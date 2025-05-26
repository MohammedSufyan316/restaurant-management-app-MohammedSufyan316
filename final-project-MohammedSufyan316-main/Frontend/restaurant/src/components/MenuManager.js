import React, { useState, useEffect } from "react";

const MenuManager = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "", description: "" });
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch menu items from the API
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5128/api/menu");
      if (response.ok) {
        const data = await response.json();
        setMenuItems(data);
      } else {
        throw new Error("Failed to fetch menu items.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add a new menu item
  const addMenuItem = async () => {
    try {
      const response = await fetch("http://localhost:5128/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      if (response.ok) {
        await fetchMenuItems();
        setNewItem({ name: "", price: "", description: "" });
      } else {
        throw new Error("Failed to add menu item.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Update an existing menu item
  const updateMenuItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:5128/api/menu/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });
      if (response.ok) {
        await fetchMenuItems();
        setEditingItem(null);
      } else {
        throw new Error("Failed to update menu item.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete a menu item
  const deleteMenuItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:5128/api/menu/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchMenuItems();
      } else {
        throw new Error("Failed to delete menu item.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch menu items on component mount
  useEffect(() => {
    fetchMenuItems();
  }, []);

  return (
    <div className="manage-menu">
      <h2>Manage Menu</h2>
      {error && <p className="text-danger">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h3>Menu Items</h3>
          <ul className="list-group mb-4">
            {menuItems.map((item) => (
              <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                {editingItem && editingItem.id === item.id ? (
                  <div className="w-100">
                    <input
                      type="text"
                      className="form-control mb-2"
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    />
                    <input
                      type="number"
                      className="form-control mb-2"
                      value={editingItem.price}
                      onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                    />
                    <textarea
                      className="form-control mb-2"
                      value={editingItem.description}
                      onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    />
                    <button className="btn btn-primary me-2" onClick={() => updateMenuItem(item.id)}>Save</button>
                    <button className="btn btn-secondary" onClick={() => setEditingItem(null)}>Cancel</button>
                  </div>
                ) : (
                  <div className="d-flex justify-content-between w-100">
                    <div>
                      <h5>{item.name}</h5>
                      <p>${item.price.toFixed(2)}</p>
                      <p>{item.description}</p>
                    </div>
                    <div>
                      <button className="btn btn-warning me-2" onClick={() => setEditingItem(item)}>Edit</button>
                      <button className="btn btn-danger" onClick={() => deleteMenuItem(item.id)}>Delete</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <h3>Add New Item</h3>
          <div className="mb-3">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            />
            <textarea
              className="form-control mb-2"
              placeholder="Description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />
            <button className="btn btn-success" onClick={addMenuItem}>Add Item</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuManager;
