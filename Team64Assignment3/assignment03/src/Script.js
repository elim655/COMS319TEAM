import React, { useState } from "react";
import AddProductForm from "./AddProductForm";
import ProductList from "./ProductList";
import UpdateProductForm from "./UpdateProduct";
import DeleteProductForm from "./DeleteProduct";
import logo from "./LiveTix.jpg";

const App = () => {
  const [currentView, setCurrentView] = useState('addProduct'); // Default view

  const handleChangeView = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="app-container flex flex-col min-h-screen">
      <nav className="navbar bg-warm-gray-800 text-white p-4 flex justify-between items-center">
        <div className="logo-container flex items-center">
          <img className="logo mr-4" src={logo} alt="LiveTix Logo" width="50" />
          <h1 className="app-title text-xl font-bold">LiveTix</h1>
        </div>
        <div>
          <button onClick={() => handleChangeView('addProduct')}
            className="bg-coral-600 hover:bg-coral-700 text-white font-bold py-2 px-4 rounded mx-1">
            Add a Product
          </button>
          <button onClick={() => handleChangeView('showProducts')}
            className="bg-coral-600 hover:bg-coral-700 text-white font-bold py-2 px-4 rounded mx-1">
            Show Items
          </button>
          <button onClick={() => handleChangeView('updateProduct')}
            className="bg-coral-600 hover:bg-coral-700 text-white font-bold py-2 px-4 rounded mx-1">
            Update Item
          </button>
          <button onClick={() => handleChangeView('deleteProduct')}
            className="bg-coral-600 hover:bg-coral-700 text-white font-bold py-2 px-4 rounded mx-1">
            Delete Item
          </button>
        </div>
      </nav>
      <main className="content flex-grow p-10">
        {currentView === 'addProduct' && <AddProductForm />}
        {currentView === 'showProducts' && <ProductList />}
        {currentView === 'updateProduct' && <UpdateProductForm />} 
        {currentView === 'deleteProduct' && <DeleteProductForm />} 
      </main>
    </div>
  );
};

export default App;
