import React, { useState, useEffect } from 'react';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Fetch all products
    useEffect(() => {
        fetch('http://localhost:8081/products')
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    // Fetch a single product by ID
    const fetchProductById = (id) => {
        fetch(`http://localhost:8081/products/${id}`)
            .then(response => response.json())
            .then(data => setSelectedProduct(data))
            .catch(error => console.error('Error fetching product:', error));
    };

    return (
        <div className="overflow-y-scroll max-h-800px p-6 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map(product => (
                <div key={product.id} className="transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl rounded-lg overflow-hidden">
                    <img className="w-full h-48 object-cover object-center" src={product.image} alt={product.title} />
                    <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.title}</h3>
                        <p className="text-gray-600 text-sm">Category: {product.category}</p>
                        <p className="text-gray-600 text-sm">{product.description}</p>
                        <div className="flex items-center justify-between mt-2">
                            <button onClick={() => fetchProductById(product.id)} className="btn btn-primary">
                                View Details
                            </button>
                            <span className="text-green-500 text-sm font-semibold">${product.price}</span>
                        </div>
                    </div>
                </div>
            ))}
            {selectedProduct && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full px-4">
                    <div className="relative top-20 mx-auto shadow-lg rounded-md bg-white max-w-lg p-4">
                        <h2 className="text-xl font-bold">{selectedProduct.title}</h2>
                        <p>{selectedProduct.description}</p>
                        <p>Price: ${selectedProduct.price}</p>
                        <button onClick={() => setSelectedProduct(null)} className="btn btn-secondary">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
