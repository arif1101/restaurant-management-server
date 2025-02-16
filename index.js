const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

app.use(cors());
app.use(express.json());


// hotel_manager
// P2ZEO2b2bnHJ7UCg



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hvsn9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");


    // foods related apis 
    const foodsCollection = client.db('restaurentManagement').collection('foods');
    const foodOrderCollection = client.db('restaurentManagement').collection('foodOrders');

    app.get('/foods', async(req, res) => {
        const cursor = foodsCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    // get data by specific data 
    app.get('/foods/:id', async(req, res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await foodsCollection.findOne(query);
      res.send(result)
    })
    // get specific user order 
    app.get('/food-orders', async(req, res) => {
      const email = req.query.email;
      const query = {orderByEmail: email}
      const result = await foodOrderCollection.find(query).toArray();
      res.send(result);
    })

    // food order 
    app.post('/food-order', async (req, res) => {
      const order = req.body;
      const result = await foodOrderCollection.insertOne(order);
      res.send(result)
    })
    
    
    
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Job is falling from the sky')
})

app.listen(port, () => {
    console.log(`Job is waiting at: ${port}`)
})