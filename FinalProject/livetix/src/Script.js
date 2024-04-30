import logo from "./LiveTix.jpg";
import "./style.css";
import React, { useState, useEffect } from 'react';
import BrowseView from "./BrowserView.js";

const CartView = ({
  cart,
  setCart,
  removeFromCart,
  addToCart,
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
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!fullName.trim()) errors.fullName = "Full Name is required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errors.email = "Valid email is required";
    if (!cardNumber.trim() || cardNumber.replace(/\s/g, "").length !== 16) errors.cardNumber = "Valid card number is required";
    if (!address1.trim()) errors.address1 = "Address Line 1 is required";
    if (!city.trim()) errors.city = "City is required";
    if (!state.trim()) errors.state = "State is required";
    if (!zip.trim() || zip.length !== 5) errors.zip = "Valid ZIP Code is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

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
  const handleCheckout = async (event) => {
    event.preventDefault();
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items before checking out.");
        return;
    }
    if (validateForm()) {
        const orderData = {
            fullName,
            email,
            cardNumber,
            address1,
            address2,
            city,
            state,
            zip,
            cartItems: cart,
            totalPrice: grandTotal
        };
        try {
            const response = await fetch('http://localhost:8081/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });
            const result = await response.json();
            if (response.ok) {
                alert('Order placed successfully! Your order number is: ' + result.orderNumber);
                setCart([]);
                goToConfirmationView(result.orderNumber);
            } else {
                throw new Error('Failed to place order');
            }
        } catch (error) {
            console.error('Failed to place order:', error);
            alert('Failed to place order: ' + error.message);
        }
    } else {
        console.log("Form validation failed");
    }
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
                className={`form-control ${formErrors.fullName ? 'is-invalid' : ''}`}
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
              />
              {formErrors.fullName && <div className="invalid-feedback">{formErrors.fullName}</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                required
              />
              {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="cardNumber">Card Number</label>
            <input
              type="text"
              className={`form-control ${formErrors.cardNumber ? 'is-invalid' : ''}`}
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              pattern="\d{16}"
              required
            />
            {formErrors.cardNumber && <div className="invalid-feedback">{formErrors.cardNumber}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="address1">Address Line 1</label>
            <input
              type="text"
              className={`form-control ${formErrors.address1 ? 'is-invalid' : ''}`}
              id="address1"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              placeholder="1234 Main St"
              required
            />
            {formErrors.address1 && <div className="invalid-feedback">{formErrors.address1}</div>}
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
                className={`form-control ${formErrors.city ? 'is-invalid' : ''}`}
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
              {formErrors.city && <div className="invalid-feedback">{formErrors.city}</div>}
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="state">State</label>
              <input
                type="text"
                className={`form-control ${formErrors.state ? 'is-invalid' : ''}`}
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
              {formErrors.state && <div className="invalid-feedback">{formErrors.state}</div>}
            </div>
            <div className="col-md-4 mb-3">
              <label htmlFor="zip">ZIP Code</label>
              <input
                type="text"
                className={`form-control ${formErrors.zip ? 'is-invalid' : ''}`}
                id="zip"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                pattern="\d{5}"
                required
              />
              {formErrors.zip && <div className="invalid-feedback">{formErrors.zip}</div>}
            </div>
          </div>
        </div>
        <button
          className="btn btn-primary btn-lg btn-block"
          type="submit"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

const ConfirmationView = ({ orderNumber, returnToBrowseView, goToModifyOrderView }) => {
  const [orderDetails, setOrderDetails] = useState({
    cartItems: [],
    fullName: "",
    email: "",
    cardNumber: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    totalPrice: 0,
    tax: 0,
    grandTotal: 0
  });

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderNumber) return;
      
      try {
        const response = await fetch(`http://localhost:8081/orders/${orderNumber}`);
        if (response.ok) {
          const data = await response.json();
          setOrderDetails({
            ...data,
            tax: data.totalPrice * 0.1,
            grandTotal: data.totalPrice * 1.1
          });
        } else {
          console.error('Order not found');
          throw new Error('Order not found');
        }
      } catch (error) {
        console.error('Failed to fetch order details:', error);
      }
    };

    fetchOrderDetails();
  }, [orderNumber]);

  const {
    cartItems,
    fullName,
    email,
    cardNumber,
    address1,
    address2,
    city,
    state,
    zip,
    totalPrice,
    tax,
    grandTotal
  } = orderDetails;

  return (
    <div className="container my-4">
      <div className="text-center mb-4">
        <h2>Your Order <strong>{orderNumber}</strong> is Confirmed!</h2>
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
            {cartItems.map((item, index) => (
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
                <td>${item.price ? item.price.toFixed(2) : '0.00'}</td>
                <td>{item.quantity}</td>
                <td>${item.totalPrice ? item.totalPrice.toFixed(2) : '0.00'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="total-price text-right mb-4">
        <p>
          Subtotal: <strong>${totalPrice ? totalPrice.toFixed(2) : '0.00'}</strong>
        </p>
        <p>
          Tax: <strong>${tax ? tax.toFixed(2) : '0.00'}</strong>
        </p>
        <p>
          Total: <strong>${grandTotal ? grandTotal.toFixed(2) : '0.00'}</strong>
        </p>
      </div>
      <div className="customer-info mb-4">
        <div>
          <h3>Customer Information</h3>
          <p>Full Name: {fullName}</p>
          <p>Email: {email}</p>
          <p>Card Number: {cardNumber}</p>
          <p>Address Line 1: {address1}</p>
          <p>Address Line 2: {address2}</p>
          <p>City: {city}</p>
          <p>State: {state}</p>
          <p>ZIP Code: {zip}</p>
        </div>
      </div>
      <button onClick={returnToBrowseView} className="btn btn-secondary mb-4">
        Return to Browse
      </button>
      <button onClick={() => goToModifyOrderView(orderNumber)} className="btn btn-primary mb-4">
        Modify Order
      </button>
    </div>
  );
};

const ModifyOrderView = ({ orderNumber, returnToConfirmationView }) => {
  const [orderDetails, setOrderDetails] = useState({
      email: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
      const fetchOrderDetails = async () => {
          setLoading(true);
          try {
              const response = await fetch(`http://localhost:8081/orders/${orderNumber}`);
              const data = await response.json();
              if (response.ok) {
                  setOrderDetails(data);
              } else {
                  throw new Error(data.message || 'Failed to fetch order details.');
              }
          } catch (error) {
              setError(error.message);
          } finally {
              setLoading(false);
          }
      };

      fetchOrderDetails();
  }, [orderNumber]);

  const handleChange = (e) => {
      const { name, value } = e.target;
      setOrderDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
          const response = await fetch(`http://localhost:8081/orders/${orderNumber}`, {
              method: 'PATCH',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(orderDetails)
          });
          if (!response.ok) throw new Error('Failed to update order.');
          alert('Order updated successfully');
          returnToConfirmationView(orderNumber); // Here we ensure to navigate back with the order number
      } catch (error) {
          setError(error.message);
      } finally {
          setLoading(false);
      }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
      <form onSubmit={handleSubmit}>
          <label>Email: <input type="email" name="email" value={orderDetails.email} onChange={handleChange} /></label>
          <label>Address Line 1: <input type="text" name="address1" value={orderDetails.address1} onChange={handleChange} /></label>
          <label>Address Line 2: <input type="text" name="address2" value={orderDetails.address2} onChange={handleChange} /></label>
          <label>City: <input type="text" name="city" value={orderDetails.city} onChange={handleChange} /></label>
          <label>State: <input type="text" name="state" value={orderDetails.state} onChange={handleChange} /></label>
          <label>ZIP Code: <input type="text" name="zip" value={orderDetails.zip} onChange={handleChange} /></label>
          <button type="submit">Save Changes</button>
          <button type="button" onClick={() => returnToConfirmationView(orderNumber)}>Cancel</button>
      </form>
  );
};



const App = () => {
  const [currentView, setCurrentView] = useState(0);
  const [cart, setCart] = useState([]);
  const [orderNumber, setOrderNumber] = useState('');

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

  function howManyofThis(id) {
    let hmot = cart.filter((cartItem) => cartItem.id === id);
    return hmot.length;
  }

  const goToCartView = () => {
    setCurrentView(1);
  };

  const returnToBrowseView = () => {
    setCurrentView(0);
  };

  const goToConfirmationView = (orderNum) => {
    setOrderNumber(orderNum);
    setCurrentView(2); 
  };

  const returnToConfirmationView = (orderNum) => {
    setOrderNumber(orderNum);
    setCurrentView(2); 
  };

const goToModifyOrderView = (orderNum) => {
  setOrderNumber(orderNum);
  setCurrentView(3); 
  };

  return (
    <div className="app-container flex flex-col min-h-screen">
      <nav className="navbar bg-warm-gray-800 text-white p-4 flex justify-between items-center">
        <div className="logo-container flex items-center">
          <img className="logo mr-4" src={logo} alt="LiveTix Logo" width="50" />
          <h1 className="app-title text-xl font-bold">LiveTix</h1>
        </div>

        <div className="cart-menu">
          <button onClick={goToCartView} className="cart-button bg-coral-600 hover:bg-coral-700 rounded-full px-3p y-1 text-sm font-medium mr-2">
            Go to Cart
          </button>
        </div>
      </nav>
      <main className="content flex-grow p-10">
        {currentView === 0 && (
          <BrowseView
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            howManyofThis={howManyofThis}
          />
        )}
        {currentView === 1 && (
          <CartView
            cart={cart}
            setCart = {setCart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            returnToBrowseView={returnToBrowseView}
            goToConfirmationView={goToConfirmationView}
          />
        )}
        {currentView === 2 && (
          <ConfirmationView
            orderNumber={orderNumber}
            returnToBrowseView={returnToBrowseView}
            goToModifyOrderView = {goToModifyOrderView}
          />
        )}
        {currentView === 3 && (
          <ModifyOrderView
            orderNumber={orderNumber}
            returnToConfirmationView={returnToConfirmationView}
          />
        )}
      </main>
    </div>
  );
};

export default App;