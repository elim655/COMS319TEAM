import logo from './LiveTix.jpg';
import './App.css';
import React, { useState } from "react";
import { Products } from "./products.js";
import { Categories } from "./Categories.js";

const render_products = (ProductsCategory) => (
  <div className='overflow-y-scroll max-h-800px p-6 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
    {ProductsCategory.map((product, index) => (
      <div key={index} className="shadow-lg rounded-lg overflow-hidden">
        <img alt="Product" src={product.image} className="w-full h-48 object-cover object-center" />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.title}</h3>
          <p className="text-gray-600 text-sm">Tag: {product.category}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-gray-500 text-sm">Rating: {product.rating.rate}</span>
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
    <div className="flex min-h-screen">
      <div className="bg-slate-800 p-3 text-white w-1/5">
        <img className="w-full mb-4" src={logo} alt="Logo" />
        <h1 className="text-2xl font-bold mb-3">Product Catalog App</h1>
        <p className="mb-10">by <span className="text-orange-400 font-bold">Edmund</span></p>
        <div>
          <p className='mb-2'>Tags:</p>
          {Categories.map(tag => (
            <button key={tag} className="bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-700 focus:ring-opacity-50 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2" onClick={() => handleClick(tag)}>{tag}</button>
          ))}
        </div>
        <input type="search" value={query} onChange={handleChange} className="mt-10 w-full p-2.5 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder="Search products..." />
      </div>
      <div className="flex-grow p-10">
        {render_products(ProductsCategory)}
      </div>
    </div>
  );
}

export default App;
