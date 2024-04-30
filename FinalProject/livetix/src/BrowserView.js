import React, { useState, useEffect } from 'react';

const BrowseView = ({ addToCart, removeFromCart, howManyofThis }) => {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8081/products');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleShowModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="overflow-y-scroll max-h-800px p-6 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((product, index) => (
        <div
          key={index}
          className="transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl rounded-lg overflow-hidden"
          onClick={() => handleShowModal(product)}
        >
          <img
            alt={product.title}
            src={product.image}
            className="w-full h-48 object-cover object-center"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {product.title}
            </h3>
            <p className="text-gray-600 text-sm">Tag: {product.category}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-green-500 text-sm font-semibold">
                ${product.price} <span className="close">&#10005;</span>
                {howManyofThis(product.id)}
              </span>
              <div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeFromCart(product); }}
                  className="btn btn-sm btn-outline-danger mr-2"
                >
                  -
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                  className="btn btn-sm btn-outline-success"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {selectedProduct && (
        <div className={`modal ${showModal ? 'd-block' : 'd-none'}`} tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedProduct.title}</h5>
              </div>
              <div className="modal-body">
                <img src={selectedProduct.image} alt={selectedProduct.title} className="img-fluid mb-2" />
                <p>{selectedProduct.description}</p>
                <p>Category: {selectedProduct.category}</p>
                <p>Price: ${selectedProduct.price} <span className="close">&#10005;</span> {howManyofThis(selectedProduct.id)}</p>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
                <button type="button" className="btn btn-primary" onClick={() => addToCart(selectedProduct)}>Add to Cart</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseView;
