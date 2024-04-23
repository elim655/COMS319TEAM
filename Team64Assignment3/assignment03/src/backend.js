var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var { MongoClient, ObjectId } = require("mongodb");

var app = express();
app.use(cors());
app.use(bodyParser.json());

const port = "8081";
const host = "localhost";

// MongoDB
const mongoUrl = "mongodb://127.0.0.1:27017";
const dbName = "reactdata"; 
const client = new MongoClient(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = client.db(dbName);

app.listen(port, () => {
    console.log(`App listening at http://${host}:${port}`);
});

app.get("/products", async (req, res) => {
  try {
      await client.connect();
      const collection = db.collection("fakestore_catalog");
      const products = await collection.find({}).toArray(); // Fetch all products
      res.status(200).json(products);
  } catch (error) {
      console.error("Failed to retrieve products:", error);
      res.status(500).json({ message: "Failed to retrieve products." });
  } finally {
      await client.close();
  }
});

app.get("/products/:id", async (req, res) => {
  const productId = parseInt(req.params.id, 10);
  if (isNaN(productId)) {
      return res.status(400).json({ message: "Invalid product ID format" });
  }

  try {
      await client.connect();
      const collection = db.collection("fakestore_catalog");
      console.log("Querying for product with ID:", productId); 
      const product = await collection.findOne({ id: productId });

      if (product) {
          res.status(200).json(product);
      } else {
          res.status(404).json({ message: "Product not found" });
      }
  } catch (error) {
      console.error("Failed to retrieve the product:", error);
      res.status(500).json({ message: "Failed to retrieve the product." });
  } finally {
      await client.close();
  }
});



app.post("/addProduct", async (req, res) => {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");

        const product = req.body;
        const collection = db.collection("fakestore_catalog");  

        // Check if product with the same id already exists
        const existingProduct = await collection.findOne({ id: product.id });
        if (existingProduct) {
            res.status(409).send({ message: "A product with this ID already exists." });
            return;
        }

        const result = await collection.insertOne(product);
        if (result.acknowledged) {
            res.status(201).send({ message: "Product added successfully", productId: result.insertedId });
        } else {
            res.status(500).send({ message: "Failed to add the product" });
        }
    } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send({ message: "An internal server error occurred" });
    } finally {
        await client.close();
    }
});

app.put("/updateProduct/:id", async (req, res) => {
  const productId = parseInt(req.params.id, 10);  
  const { price } = req.body;
  const numericPrice = parseFloat(price);  

  if (isNaN(productId) || isNaN(numericPrice)) {
      return res.status(400).send({ message: "Invalid product ID or price format" });
  }

  try {
      await client.connect();
      const collection = db.collection("fakestore_catalog");
      
      const result = await collection.updateOne(
          { id: productId },  
          { $set: { price: numericPrice } }  
      );

      if (result.matchedCount === 0) {
          return res.status(404).send({ message: "Product not found or no change made." });
      }

      if (result.modifiedCount === 0) {
          return res.status(200).send({ message: "No change made to the product." });
      }

      res.status(200).send({ message: "Product updated successfully." });
  } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).send({ message: "Internal server error" });
  } finally {
      await client.close();
  }
});


app.delete("/deleteProduct/:id", async (req, res) => {
  const productId = parseInt(req.params.id, 10); 

  try {
      await client.connect();
      const collection = db.collection("fakestore_catalog");
      
      const result = await collection.deleteOne({ id: productId });
      if (result.deletedCount === 0) {
          return res.status(404).send({ message: "Product not found or already deleted." });
      }

      res.status(200).send({ message: "Product deleted successfully." });
  } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).send({ message: "Internal server error" });
  } finally {
      await client.close();
  }
});

