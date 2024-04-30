const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");

function generateOrderNumber(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


var app = express();
app.use(cors());
app.use(bodyParser.json());

const port = "8081";
const host = "localhost";

// MongoDB
const mongoUrl = "mongodb://127.0.0.1:27017";
const dbName = "FinalProject"; 
const client = new MongoClient(mongoUrl);

app.listen(port, () => {
    console.log(`App listening at http://${host}:${port}`);
});

app.get("/products", async (req, res) => {
  try {
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection("LiveTix");
      const products = await collection.find({}).toArray();
      res.status(200).json(products);
  } catch (error) {
      console.error("Failed to retrieve products:", error);
      res.status(500).json({ message: "Failed to retrieve products." });
  } finally {
      await client.close();
  }
});

// Fetch a single product by id
app.get("/products/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection("LiveTix");
      const product = await collection.findOne({ id: parseInt(id) });
      if (!product) {
        return res.status(404).json({ message: "Product not found." });
      }
      res.status(200).json(product);
    } catch (error) {
      console.error("Failed to retrieve product:", error);
      res.status(500).json({ message: "Failed to retrieve product." });
    } finally {
      await client.close();
    }
  });
  

// Route to handle new order creation
app.post("/orders", async (req, res) => {
    const order = req.body;
    order.orderNumber = generateOrderNumber(5); // Generate a unique order number

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("Order");
        const result = await collection.insertOne(order);
        if (result.acknowledged) {
            res.status(201).json({ message: "Order placed successfully", orderId: result.insertedId, orderNumber: order.orderNumber });
        } else {
            throw new Error("Failed to insert order");
        }
    } catch (error) {
        console.error("Failed to place order:", error);
        res.status(500).json({ message: "Failed to place order.", error: error.message });
    } finally {
        await client.close();
    }
});


// Route to get order by order number
app.get("/orders/:orderNumber", async (req, res) => {
    const { orderNumber } = req.params;
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("Order");
        const order = await collection.findOne({ orderNumber: orderNumber });
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error("Failed to retrieve order:", error);
        res.status(500).json({ message: "Failed to retrieve order.", error: error.message });
    } finally {
        await client.close();
    }
});


// Update an existing order
app.patch("/orders/:orderNumber", async (req, res) => {
    const { orderNumber } = req.params;
    const updates = req.body;
    delete updates._id;

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("Order");
        const result = await collection.updateOne({ orderNumber: orderNumber }, { $set: updates });

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "No order found with that order number." });
        }

        if (result.modifiedCount === 0) {
            return res.status(200).json({ message: "Order found but no updates made." });
        }

        res.status(200).json({ message: "Order updated successfully" });
    } catch (error) {
        console.error("Failed to update order:", error);
        res.status(500).json({ message: "Failed to update order.", error: error.message });
    } finally {
        await client.close();
    }
});

// Delete an existing order
app.delete("/orders/:orderNumber", async (req, res) => {
    const { orderNumber } = req.params;

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("Order");
        const result = await collection.deleteOne({ orderNumber: orderNumber });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No order found with that order number." });
        }

        res.status(200).json({ message: "Order cancelled successfully" });
    } catch (error) {
        console.error("Failed to cancel order:", error);
        res.status(500).json({ message: "Failed to cancel order.", error: error.message });
    } finally {
        await client.close();
    }
});


// Lookup an order by email and order number using path parameters
app.get("/orders/lookup/:email/:orderNumber", async (req, res) => {
    const { email, orderNumber } = req.params;

    console.log("Received request to lookup order with email:", email, "and order number:", orderNumber);

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection("Order");

        const order = await collection.findOne({
            email: decodeURIComponent(email), 
            orderNumber: decodeURIComponent(orderNumber)
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Failed to lookup order.", error: error.toString() });
    } finally {
        await client.close();
    }
});

