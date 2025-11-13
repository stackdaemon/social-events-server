const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://social-events:m0QU0r2Rc60lsYDy@cluster0.zaaoh0g.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("social-events");
    const eventCollection = db.collection("events");
    const joinedEventsCollection = db.collection("joined-event");
    // get data [1]
    app.get("/events", async (req, res) => {
      const result = await eventCollection.find().toArray();
      res.send(result);
    });

    //!joined  [part2 [5]]
    app.get("/joined-event", async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) {
        query.email = email;
      }
      const result = await joinedEventsCollection.find(query).toArray();
      res.send(result);
    });

    // data post korbo mongodb te[]
    app.post("/events", async (req, res) => {
      const data = req.body;
      const result = await eventCollection.insertOne(data);
      res.send(
        result,
      );
    });
    //! joined btn  ar   kaj[]
    app.post("/joined-event", async (req, res) => {
      const data = req.body;
      const result = await joinedEventsCollection.insertOne(data);
      console.log(data);
      res.send({
        success: true,
        result,
      });
    });
    //*  details page
    app.get("/events/:id", async (req, res) => {
      const { id } = req.params;
      console.log(id);
      const objectId = new ObjectId(id);
      const result = await eventCollection.findOne({ _id: objectId });
      res.send({
        result,
      });
    });

    app.get("/manage_event", async (req, res) => {
      const email = req.query.email;
      const result = await eventCollection.find({createdBy:email}).toArray();
      res.send(result);
    });

    

















    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
