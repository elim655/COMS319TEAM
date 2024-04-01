import logo from './LiveTix.jpg';
import './App.css';
import React, { useState } from "react";
import { Products } from "./products.js";
import { Categories } from "./Categories.js";

const render_products = (ProductsCategory) => (
  <div className='overflow-y-scroll max-h-800px p-6 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
    {ProductsCategory.map((product, index) => (
      <div key={index} className="transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl rounded-lg overflow-hidden">
        <img alt="Product" width="300" src={product.image} className="w-full h-48 object-cover object-center" />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.title}</h3>
          <p className="text-gray-600 text-sm">Tag: {product.category}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-green-500 text-sm font-semibold">${product.price}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const App = () => {
  const [ProductsCategory, setProductsCategory] = useState(Products);
  const [query, setQuery] = useState('');

  function handleClick(tag) {
    const filtered = Products.filter(cat => cat.category === tag);
    setProductsCategory(filtered);
  }

  const handleChange = (e) => {
    setQuery(e.target.value);
    const results = Products.filter(eachProduct =>
      e.target.value === "" ? true : eachProduct.title.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setProductsCategory(results);
  }

  return (
    <div className="app-container flex flex-col min-h-screen">
      <nav className="navbar bg-warm-gray-800 text-white p-4 flex justify-between items-center">
        <div className="logo-container flex items-center">
          <img className="logo mr-4" src={logo} alt="LiveTix Logo" width="50" />
          <h1 className="app-title text-xl font-bold">LiveTix</h1>
        </div>
        <div className="tags-menu">
          {Categories.map(tag => (
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
      </nav>
      <main className="content flex-grow p-10">
        {render_products(ProductsCategory)}
      </main>
    </div>
  );
}

export default App;
