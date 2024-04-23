import React, { useState } from 'react';

const AddProductForm = () => {
    const [product, setProduct] = useState({
        id: '',
        title: '',
        price: '',
        description: '',
        category: '',
        image: '',
        rating: { rate: '', count: '' }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        let parsedValue = value;
    
        if (name === "id" || name === "count") {
            parsedValue = parseInt(value, 10) || '';  
        } else if (name === "price" || name === "rate") {
            parsedValue = parseFloat(value) || '';
        }
    
        if (name === "rate" || name === "count") {
            setProduct(prevState => ({
                ...prevState,
                rating: {
                    ...prevState.rating,
                    [name]: parsedValue
                }
            }));
        } else {
            setProduct(prevState => ({
                ...prevState,
                [name]: parsedValue
            }));
        }
    };
    

    const [productsJson, setProductsJson] = useState('');

    const handleJsonChange = (e) => {
        setProductsJson(e.target.value);
    };

    const addMultipleProducts = async () => {
        try {
            const products = JSON.parse(productsJson);
            const responses = await Promise.all(products.map(product =>
                fetch('http://localhost:8081/addProduct', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(product)
                }).then(res => res.json()) // Assuming server sends JSON responses
            ));
    
            // Filter to find any unsuccessful responses
            const errors = responses.filter(res => res.message !== "Product added successfully");
            if (errors.length > 0) {
                console.log("Errors occurred:", errors);
                alert('Some products were not added. Check console for details.');
            } else {
                alert('All products added successfully!');
            }
            setProductsJson(''); // Clear the JSON input after processing
        } catch (error) {
            console.error('Error adding products:', error);
            alert('Failed to add products: ' + error.message);
        }
    };
    
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8081/addProduct', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            if (!response.ok) throw new Error('Failed to create product');
            alert('Product added successfully!');
            setProduct({
                id: '',
                title: '',
                price: '',
                description: '',
                category: '',
                image: '',
                rating: { rate: '', count: '' }
            }); // Reset form after submission
        } catch (error) {
            console.error('Error:', error);
            alert('Error adding product: ' + error.message);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <h2 className="block text-gray-700 text-xl font-bold mb-2">Add New Product</h2>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="id">
                        ID
                    </label>
                    <input type="number" name="id" value={product.id} onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                        Title
                    </label>
                    <input type="text" name="title" value={product.title} onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                        Price
                    </label>
                    <input type="text" name="price" value={product.price} onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea name="description" value={product.description} onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                        Category
                    </label>
                    <input type="text" name="category" value={product.category} onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                        Image URL
                    </label>
                    <input type="text" name="image" value={product.image} onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rate">
                            Rating Rate
                        </label>
                        <input type="text" name="rate" value={product.rating.rate} onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="count">
                            Rating Count
                        </label>
                        <input type="text" name="count" value={product.rating.count} onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Add Product
                </button>
            </form>

            <div className="max-w-md mx-auto mt-10">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productsJson">
                        Products JSON
                    </label>
                    <textarea
                        id="productsJson"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={productsJson}
                        onChange={handleJsonChange}
                        placeholder='Enter JSON here (Starts with [{data}] )'
                    />
                </div>
                <button
                    onClick={addMultipleProducts}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Add Multiple Products
                </button>
            </div>
        </div>

        
    );
};

export default AddProductForm;
