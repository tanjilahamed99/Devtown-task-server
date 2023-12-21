const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())

// tanjilShop
// Mq8yn6EDbuXmcMSJ

app.get('/', (req, res) => {
    res.send('welcome to my server site')
})




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const buyMobilesCollection = myStore.collection("buyMobiles")

        //  get all the mobile
        app.get('/mobiles', async (req, res) => {

            const shortFlied = req.query.shortFlied
            const shortOrder = req.query.shortOrder
            const search = req.query.search

            let query = {}
            if (search !== 'undefined') {
                query.brand = { $in: search.split(',') }
            }

            const shortObj = {}

            if (shortFlied !== 'undefined' && shortOrder !== 'undefined') {
                shortObj[shortFlied] = shortOrder
            }

            const result = await productsCollection.find(query).sort(shortObj).toArray()
            res.send(result)

        })
        // get a single products 
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id
            // console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await productsCollection.findOne(query)
            res.send(result)
        })
        // update a products 
        app.patch('/product/:id', async (req, res) => {
            const updatedData = req.body
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    name: updatedData.name,
                    photo: updatedData.photo,
                    brand: updatedData.brand,
                    type: updatedData.type,
                    price: updatedData.price,
                    rating: updatedData.rating
                }
            }
            const result = await productsCollection.updateOne(query, updateDoc)
            res.send(result)

        })
        // add a new products 
        app.post('/product', async (req, res) => {
            const newProductData = req.body
            const result = await productsCollection.insertOne(newProductData)
            res.send(result)
        })

        // buy a new mobile
        app.post('/mobile', async (req, res) => {
            const buyMobileData = req.body
            const result = await buyMobilesCollection.insertOne(buyMobileData)
            res.send(result)
        })

        //  get all my cart
        app.get('/myCart', async (req, res) => {
            const result = await buyMobilesCollection.find().toArray()
            res.send(result)
        })
        // delete my cart data 
        app.delete('/myCart/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await buyMobilesCollection.deleteOne(query)
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





app.listen(port, () => {
    console.log(`website running on port ${port}`)
})