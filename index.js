const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Travel Tour is running')
})

// MongoDb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zgxio.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db("travel-tour");
    const destinationCollect = database.collection("destinationCollect");
    //   add a service
      app.post('/destinations', async (req, res) => {
          const data = req.body;
          const result = await destinationCollect.insertOne(data)
          res.send(result);
      })
    //   get all services
      app.get('/destinations', async (req, res) => {
          const coursor = destinationCollect.find({});
          const result = await coursor.toArray();
          res.send(result)
      })
    //   get a single service
      app.get('/destinations/:id', async(req, res) => {
          const id = req.params.id;
          const query = { _id: ObjectId(id) };
          const result = await destinationCollect.findOne(query)
          res.json(result)
      })
    // DELETE services
    app.delete('/destinations/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await destinationCollect.deleteOne(query);
      res.json(result)
      console.log('delete id', id)
    })
    // UPDATE services 
    app.patch('/destinations/update/:id', async (req, res) => {
      const id = req.params.id;
      const data = req.body
      console.log(data)
      const query = { _id: ObjectId(id) };
      const upData = {
        $set: {
          name: `${data.name}`,
          description: `${data.description}`,
          price: `${data.price}`,
          img: `${data.img}`
        }
      }
      const result = await destinationCollect.updateOne(query, upData);
      res.json(result)
    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('runing server on' , port)
})