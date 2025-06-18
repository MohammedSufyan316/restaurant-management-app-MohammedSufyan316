import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Menu from "./Menu";
import Cart from "./Cart";
import Dining from "./Dining";
import MyOrders from "./MyOrders";
import MenuManager from "./MenuManager"; 
import LoginPage from "./LoginPage";

const RestaurantApp = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login state
  const [isSideNavOpen, setIsSideNavOpen] = useState(false); // State for toggling side nav

  const addItemToCart = (items) => {
    setCartItems((prevCartItems) => [...prevCartItems, ...items]);
  };

  const removeItemFromCart = (itemId) => {
    setCartItems((prevCartItems) =>
      prevCartItems.filter((item) => item.id !== itemId)
    );
  };

  // Simulating authentication state change
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Toggle side nav open/close
  const toggleSideNav = () => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  return (
    <Router>
      <header className="bg-primary text-white p-3 mb-4">
        <div className="container d-flex justify-content-between align-items-center">
        <button className="btn btn-outline-light ms-2" onClick={toggleSideNav} >
            &#9776; {/* Hamburger icon */}
          </button>
          <h1 className="h3">Restaurant App</h1>
          <nav>
            {/* Login/Logout button in the header */}
            {isAuthenticated ? (
              <button className="btn btn-link text-white" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <Link className="btn btn-link text-white" to="/login">
                Login
              </Link>
            )}
          </nav>

        </div>
      </header>

      <div
        className={`offcanvas offcanvas-start ${isSideNavOpen ? "show" : ""}`}
        tabIndex="-1"
        id="sideNav"
        aria-labelledby="sideNavLabel"
      >
        <div className="offcanvas-header">
          <h5 id="sideNavLabel">Navigation</h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            onClick={toggleSideNav}
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link className="nav-link" to="/menu">
                Menu
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                Cart
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/dining">
                Dining
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/my-orders">
                My Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/menu-manager">
                Manage Menu
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <main className="container">
        <Routes>
          <Route path="/menu" element={<Menu addToCart={addItemToCart} />} />
          <Route
            path="/cart"
            element={<Cart cartItems={cartItems} removeItem={removeItemFromCart} setCartItems={setCartItems} tableNumber={selectedTable} />}
          />
          <Route path="/dining" element={<Dining setSelectedTable={setSelectedTable} />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/menu-manager" element={<MenuManager />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
    </Router>
  );
};

export default RestaurantApp;
