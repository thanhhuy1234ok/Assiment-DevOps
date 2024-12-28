const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const app = express()

app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';

const productSchema = new mongoose.Schema({
    name: String,
    price: Number
})

const ProductModel = mongoose.model('Product', productSchema)
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
    
app.get('/', (req, res) => {
    res.send('Hello World')
})

app.post('/api/v1/products', (req, res) => {
    const product = new ProductModel(req.body)
    product.save()
})

app.get("/api/v1/products", (req, res) => {
    ProductModel.find().then((products) => {
        res.json(products)
    })
})

app.get('/api/v1/products/:id', (req, res) => {
    ProductModel.findById(req.params.id).then((product) => {
        res.json(product)
    })
})
app.listen(
    PORT,
    () => console.log(`Server is running on port ${PORT}`)
)
