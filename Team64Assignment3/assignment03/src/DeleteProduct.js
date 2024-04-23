import React, { useState, useEffect } from 'react';

const DeleteProduct = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [confirmText, setConfirmText] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:8081/products');
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
            } else {
                alert('Failed to fetch products');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const deleteProduct = async () => {
        if (confirmText.toUpperCase() === "DELETE") {
            try {
                const response = await fetch(`http://localhost:8081/deleteProduct/${selectedProduct.id}`, { method: 'DELETE' });
                if (response.ok) {
                    alert('Product deleted successfully');
                    fetchProducts();  // Refresh the product list
                    setSelectedProduct(null);
                    setConfirmText('');
                } else {
                    const data = await response.json();
                    alert(data.message || 'Failed to delete product');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        } else {
            alert('Please confirm the deletion by typing "DELETE" in the confirmation box.');
        }
    };

    return (
        <div className="delete-product">
            <h3>Select a Product to Delete</h3>
            <div className="container">
                <div className="list-group">
                    {products.map(product => (
                        <button key={product.id} onClick={() => setSelectedProduct(product)}
                            className={`list-group-item list-group-item-action ${selectedProduct && selectedProduct.id === product.id ? 'active' : ''}`}>
                            {product.title} - ${product.price}
                        </button>
                    ))}
                </div>

                {selectedProduct && (
                    <div className="card mt-3">
                        <div className="card-body">
                            <h5 className="card-title">Confirm Deletion for {selectedProduct.title}</h5>
                            <img src={selectedProduct.image} alt={selectedProduct.title} className="img-fluid mb-2" style={{ maxHeight: '200px' }} />
                            <p>Description: {selectedProduct.description}</p>
                            <p>Price: ${selectedProduct.price}</p>
                            <input type="text" className="form-control mb-2" placeholder="Type DELETE to confirm"
                                value={confirmText} onChange={(e) => setConfirmText(e.target.value)} />
                            <button className="btn btn-danger" onClick={deleteProduct}>Delete Product</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeleteProduct;
