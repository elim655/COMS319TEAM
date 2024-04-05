import logo from "./LiveTix.jpg";
import "./App.css";
import React, { useState } from "react";
import { Products } from "./products.js";
import { Categories } from "./Categories.js";

const BrowseView = ({ items, addToCart, removeFromCart, howManyofThis }) => (
  <div className="overflow-y-scroll max-h-800px p-6 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    {items.map((product, index) => (
      <div
        key={index}
        className="transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl rounded-lg overflow-hidden"
      >
        <img
          alt="Product"
          width="300"
          src={product.image}
          className="w-full h-48 object-cover object-center"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            {product.title}
          </h3>
          <p className="text-gray-600 text-sm">Tag: {product.category}</p>
          <div class="col">
            <button
              onClick={() => removeFromCart(product)}
              className="btn btn-sm btn-outline-danger mr-2"
            >
              -
            </button>
            <button
              onClick={() => addToCart(product)}
              className="btn btn-sm btn-outline-success"
            >
              +
            </button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-green-500 text-sm font-semibold">
              ${product.price} <span class="close">&#10005;</span>
              {howManyofThis(product.id)}
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const CartView = ({
  cart,
  removeFromCart,
  addToCart,
  checkout,
  returnToBrowseView,
  goToConfirmationView,
}) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  const aggregateCartItems = (cartItems) => {
    const aggregatedItems = {};

    cartItems.forEach((item) => {
      if (aggregatedItems[item.id]) {
        aggregatedItems[item.id].quantity += 1;
        aggregatedItems[item.id].totalPrice += item.price;
      } else {
        aggregatedItems[item.id] = {
          ...item,
          quantity: 1,
          totalPrice: item.price,
        };
      }
    });

    return Object.values(aggregatedItems);
  };

  const aggregatedCartItems = aggregateCartItems(cart);

  // Calculate the total price of items in the cart
  const totalPrice = cart.reduce((total, item) => total + item.price, 0);
  // Assuming tax rate of 10%
  const tax = totalPrice * 0.1;
  const grandTotal = totalPrice + tax;
  const handleCheckout = (event) => {
    event.preventDefault();
    checkout({
      fullName,
      email,
      cardNumber,
      address1,
      address2,
      city,
      state,
      zip,
    });
  };

  return (
    <div className="container my-4">
      <div className="text-center mb-4">
        <h2>Your Cart</h2>
      </div>
      <button onClick={returnToBrowseView} className="btn btn-secondary mb-4">
        Return to Browse
      </button>
      <div className="cart-items mb-4">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Total</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {aggregatedCartItems.map((item, index) => (
              <tr key={index}>
                <td>
                  <img
                    src={item.image}
                    alt={item.title}
                    width="50"
                    height="50"
                    className="mr-3"
                  />
                  {item.title}
                </td>
                <td>${item.price.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>${item.totalPrice.toFixed(2)}</td>
                <td>
                  <button
                    onClick={() => removeFromCart(item)}
                    className="btn btn-sm btn-outline-danger mr-2"
                  >
                    -
                  </button>
                  <button
                    onClick={() => addToCart(item)}
                    className="btn btn-sm btn-outline-success"
                  >
                    +
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="total-price text-right mb-4">
        <p>
          Subtotal: <strong>${totalPrice.toFixed(2)}</strong>
        </p>
        <p>
          Tax: <strong>${tax.toFixed(2)}</strong>
        </p>
        <p>
          Total: <strong>${grandTotal.toFixed(2)}</strong>
        </p>
      </div>
      <form onSubmit={handleCheckout} className="needs-validation" noValidate>
        <div className="form-row">
          <div className="row mb-3">
            <div className="col-md-6 mb-3">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                className="form-control"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
              />
              <div className="invalid-feedback">
                Please enter your full name.
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                required
              />
              <div className="invalid-feedback">
                Please enter a valid email address.
              </div>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              type="text"
              className="form-control"
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              pattern="\d{16}"
              required
            />
            <div className="invalid-feedback">
              Card number must be 16 digits.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="address1">Address Line 1</label>
            <input
              type="text"
              className="form-control"
              id="address1"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              placeholder="1234 Main St"
              required
            />
            <div className="invalid-feedback">Please enter your address.</div>
          </div>
          <div className="mb-3">
            <label htmlFor="address2">Address Line 2 (Optional)</label>
            <input
              type="text"
              className="form-control"
              id="address2"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              placeholder="Apartment or suite"
            />
          </div>
          <div className="row mb-3">
            <div className="col-md-4 mb-3">
              <label htmlFor="city">City</label>
              <input
                type="text"
                className="form-control"
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              <div className="invalid-feedback">Please enter your city.</div>
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="state">State</label>
              <input
                type="text"
                className="form-control"
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
              <div className="invalid-feedback">Please enter your state.</div>
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="zip">ZIP Code</label>
              <input
                type="text"
                className="form-control"
                id="zip"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                pattern="\d{5}"
                required
              />
              <div className="invalid-feedback">
                Please enter a valid ZIP code.
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={goToConfirmationView}
          className="btn btn-primary btn-lg btn-block"
          type="submit"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

const ConfirmationView = ({ cart, dataF}) => {
  const aggregateCartItems = (cartItems) => {
    const aggregatedItems = {};

    cartItems.forEach((item) => {
      if (aggregatedItems[item.id]) {
        aggregatedItems[item.id].quantity += 1;
        aggregatedItems[item.id].totalPrice += item.price;
      } else {
        aggregatedItems[item.id] = {
          ...item,
          quantity: 1,
          totalPrice: item.price,
        };
      }
    });

    return Object.values(aggregatedItems);
  };

  const aggregatedCartItems = aggregateCartItems(cart);

  // Calculate the total price of items in the cart
  const totalPrice = cart.reduce((total, item) => total + item.price, 0);
  // Assuming tax rate of 10%
  const tax = totalPrice * 0.1;
  const grandTotal = totalPrice + tax;

  return (
    <div className="container my-4">
      <div className="text-center mb-4">
        <h2>Your Order is Confirmed!</h2>
      </div>
      <div className="cart-items mb-4">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            {aggregatedCartItems.map((item, index) => (
              <tr key={index}>
                <td>
                  <img
                    src={item.image}
                    alt={item.title}
                    width="50"
                    height="50"
                    className="mr-3"
                  />
                  {item.title}
                </td>
                <td>${item.price.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>${item.totalPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="total-price text-right mb-4">
        <p>
          Subtotal: <strong>${totalPrice.toFixed(2)}</strong>
        </p>
        <p>
          Tax: <strong>${tax.toFixed(2)}</strong>
        </p>
        <p>
          Total: <strong>${grandTotal.toFixed(2)}</strong>
        </p>
      </div>
      <div className="customer-info mb-4">
        <h3>Customer Information</h3>
        <p>Full Name: {dataF.fullName}</p>
        <p>Email: </p>
        <p>Card Number: </p>
        <p>Address Line 1: </p>
        <p>Address Line 2: </p>
        <p>City: </p>
        <p>State: </p>
        <p>ZIP Code: </p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="btn btn-secondary mb-4"
      >
        Return to Browse
      </button>
    </div>
  );
};

const App = () => {
  const [currentView, setCurrentView] = useState(0);
  const [cart, setCart] = useState([]);
  const [dataF, setDataF] = useState({});
  const [ProductsCategory, setProductsCategory] = useState(Products);
  const [query, setQuery] = useState("");

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const removeFromCart = (item) => {
    let found = false;

    const updatedCart = cart.reduce((accumulator, currentItem) => {
      if (!found && currentItem.id === item.id) {
        found = true;
        if (accumulator.filter((x) => x.id === currentItem.id).length > 1) {
          return accumulator;
        }
        return accumulator;
      } else {
        accumulator.push(currentItem);
      }
      return accumulator;
    }, []);

    setCart(updatedCart);
  };

  const resetFilters = () => {
    setProductsCategory(Products);

    setQuery("");

    setCurrentView(0);
  };

  function handleClick(tag) {
    const filtered = Products.filter((cat) => cat.category === tag);
    setProductsCategory(filtered);
  }

  const handleChange = (e) => {
    setQuery(e.target.value);
    const results = Products.filter((eachProduct) =>
      e.target.value === ""
        ? true
        : eachProduct.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setProductsCategory(results);
  };

  function howManyofThis(id) {
    let hmot = cart.filter((cartItem) => cartItem.id == id);
    return hmot.length;
  }

  const checkout = (event) => {
    // Process checkout info
    setDataF(event);
  }

  const goToCartView = () => {
    setCurrentView(1);
  };

  const returnToBrowseView = () => {
    setCurrentView(0);
  };

  const goToConfirmationView = () => {
    setCurrentView(2);
  };

  return (
    <div className="app-container flex flex-col min-h-screen">
      <nav className="navbar bg-warm-gray-800 text-white p-4 flex justify-between items-center">
        <div
          className="logo-container flex items-center"
          onClick={resetFilters}
        >
          <img className="logo mr-4" src={logo} alt="LiveTix Logo" width="50" />
          <h1 className="app-title text-xl font-bold">LiveTix</h1>
        </div>
        <div className="tags-menu">
          {Categories.map((tag) => (
            <button
              key={tag}
              className="tag-button bg-coral-600 hover:bg-coral-700 rounded-full px-3 py-1 text-sm font-medium mr-2"
              onClick={() => handleClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="search-bar">
          <input
            type="search"
            value={query}
            onChange={handleChange}
            className="search-input w-full p-2 text-sm text-warm-gray-900 bg-warm-gray-50 rounded-lg border border-warm-gray-300 focus:ring-coral-500 focus:border-coral-500"
            placeholder="Search for events..."
          />
        </div>

        <div className="cart-menu">
          <button
            onClick={goToCartView}
            className="cart-button bg-coral-600 hover:bg-coral-700 rounded-full px-3p y-1 text-sm font-medium mr-2"
          >
            Go to Cart
          </button>
        </div>
      </nav>
      <main className="content flex-grow p-10">
        {currentView === 0 && (
          <BrowseView
            items={ProductsCategory}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            howManyofThis={howManyofThis}
          />
        )}
        {currentView === 1 && (
          <CartView
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            checkout={checkout}
            returnToBrowseView={returnToBrowseView}
            goToConfirmationView={goToConfirmationView}
          />
        )}
        {currentView === 2 && (
          <ConfirmationView
            cart={cart}
            dataF={dataF}
          />
        )}
      </main>
    </div>
  );
};

export default App;
