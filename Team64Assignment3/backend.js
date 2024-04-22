// Author: Edmund Lim
//     ISU Netid : elim655@iastate.edu
//     Date :  April 15, 2024

var express = require("express");
var cors = require("cors");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());

const port = "8081";
const host = "localhost";

const { MongoClient } = require("mongodb");
// MongoDB
const imageUrl = "mongodb://127.0.0.1:27017";
const dbName = "reactdata";
const client = new MongoClient(imageUrl);
const db = client.db(dbName);

app.listen(port, () => {
    console.log("App listening at http://%s:%s", host, port);
});

app.get("/listRobots", async (req, res) => {
    await client.connect();
    console.log("Node connected successfully to GET MongoDB");
    const query = {};
    const results = await db
    .collection("fakestore_catalog")
    .find(query)
    .limit(100)
    .toArray();
    console.log(results);
    res.status(200);
    res.send(results);

});

app.get("/:id", async (req, res) => {
    const robotid = Number(req.params.id);
    console.log("Robot to find :", robotid);
    await client.connect();
    console.log("Node connected successfully to GET-id MongoDB");
    const query = {"id": robotid };
    const results = await db.collection("fakestore_catalog")
    .findOne(query);
    console.log("Results :", results);
    if (!results) res.send("Not Found").status(404);
    else res.send(results).status(200);
});

app.post("/addProduct", async (req, res) => {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: 'Bad request: No data provided.' });
      }
  
      const { id, title, price, description, category, imageUrl, rating } = req.body;
  
      // Validate input
      if (!id || !title || !price || !description || !category || !imageUrl || !rating || !rating.rate || !rating.count) {
        return res.status(400).json({ error: 'Bad request: Missing required fields.' });
      }
  
      // Check if product with same ID already exists
      const existingProduct = await db.collection("fakestore_catalog").findOne({ "id": id });
      if (existingProduct) {
        return res.status(409).json({ error: 'Conflict: A product with this ID already exists.' });
      }
  
      // Insert new product
      const newProduct = {
        id: id,
        title: title,
        price: price,
        description: description,
        category: category,
        imageUrl: imageUrl,
        rating: rating
      };
      const result = await db.collection("fakestore_catalog").insertOne(newProduct);
  
      // Respond with success
      res.status(200).json({ message: 'Product added successfully.', productId: result.insertedId });
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).json({ error: "An internal server error occurred." });
    }
  });

app.delete("/deleteRobot/:id", async (req, res) => {
    try {
    const id = Number(req.params.id);
    await client.connect();
    console.log("Robot to delete :",id);
    const query = { id: id };
    
    // read data from robot to delete to send it to frontend
    const robotDeleted = await db.collection("fakestore_catalog").findOne(query);
    res.send(robotDeleted);

    // delete
    const results = await db.collection("fakestore_catalog").deleteOne(query);
    res.status(200);
    // res.send(results);
    }
    catch (error){
    console.error("Error deleting robot:", error);
    res.status(500).send({ message: 'Internal Server Error' });
    }
});


app.put("/updateRobot/:id", async (req, res) => {
    const id = Number(req.params.id);
    const query = { id: id };
    await client.connect();
    console.log("Robot to Update :",id);
    // Data for updating the document, typically comes from the request body
    console.log(req.body);
    const updateData = {
    $set:{
    "name": req.body.name,
    "price": req.body.price,
    "description": req.body.description,
    "imageUrl": req.body.imageUrl
    }
    };

    // read data from robot to update to send to frontend
    const robotUpdated = await db.collection("fakestore_catalog").findOne(query);
    res.send(robotUpdated);

    // Add options if needed, for example { upsert: true } to create a document if it doesn't exist
    const options = { };
    const results = await db.collection("fakestore_catalog").updateOne(query, updateData, options);
    // If no document was found to update, you can choose to handle it by sending a 404 response
    if (results.matchedCount === 0) {
        return res.status(404).send({ message: 'Robot not found' });
    }
    res.status(200);
    // res.send(results);
});
