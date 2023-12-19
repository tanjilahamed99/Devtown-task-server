const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5001


app.use(cors)
app.use(express.json())

// tanjilShop
// Mq8yn6EDbuXmcMSJ



const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://<username>:<password>@cluster0.8mn4lkn.mongodb.net/?retryWrites=true&w=majority";
const uri = "mongodb+srv://tanjilShop:Mq8yn6EDbuXmcMSJ@cluster0.8mn4lkn.mongodb.net/?retryWrites=true&w=majority";

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
        // await client.connect();
        const myStore = client.db("myStore")
        const productsCollection = myStore.collection("products")

        app.get('/mobiles', async (req, res) => {
            const result = await productsCollection.find()
            res.send(result)

        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('welcome to my server site')
})

app.listen(port, () => {
    console.log(`website running on port ${port}`)
})