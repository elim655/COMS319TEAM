import React, { useState, useEffect } from 'react';

const UpdateProduct = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newPrice, setNewPrice] = useState('');

    useEffect(() => {
        fetch('http://localhost:8081/products')
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error fetching products:', error));
    }, []);

    const selectProduct = (product) => {
        setSelectedProduct(product);
        setNewPrice(product.price);
    };

    const updateProductPrice = async () => {
        if (!selectedProduct) return;

        try {
            const response = await fetch(`http://localhost:8081/updateProduct/${selectedProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ price: newPrice })
            });
            const data = await response.json();
            if (response.ok) {
                alert('Product price updated successfully');
                // Update the list of products with the new price
                const updatedProducts = products.map(p => {
                    if (p.id === selectedProduct.id) {
                        return { ...p, price: newPrice };
                    }
                    return p;
                });
                setProducts(updatedProducts);
                // Clear selection
                setSelectedProduct(null);
                setNewPrice('');
            } else {
                alert(data.message || 'Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <div className="update-product">
            <h3>Select a Product to Update</h3>
            <div className="container">
            <div className="list-group">
                {products.map(product => (
                    <button key={product.id} onClick={() => selectProduct(product)}
                        className={`list-group-item list-group-item-action ${selectedProduct && selectedProduct.id === product.id ? 'active' : ''}`}>
                        {product.title} - ${product.price}
                    </button>
                ))}
            </div>

            {selectedProduct && (
                <div className="card mt-3">
                    <div className="card-body">
                        <h5 className="card-title">Update Price for {selectedProduct.title}</h5>
                        <img src={selectedProduct.image} alt={selectedProduct.title} className="img-fluid mb-2" style={{ maxHeight: '200px' }} />
                        <p className="card-text">Current Price: ${selectedProduct.price}</p>
                        <input type="number" className="form-control mb-2" placeholder="New Price"
                            value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
                        <button className="btn btn-primary" onClick={updateProductPrice}>Update Price</button>
                        <button className="btn btn-secondary ml-2" onClick={() => setSelectedProduct(null)}>Cancel</button>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
};

export default UpdateProduct;
