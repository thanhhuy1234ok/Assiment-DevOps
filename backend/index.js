const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const app = express()

app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 8081;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://nguyenvothanhhuy2002:R0BnfVRCE2eUA69n@cluster0.qzkol.mongodb.net/mydatabase';

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


app.delete('/api/v1/products/:id', (req, res) => {
    ProductModel.findByIdAndDelete(req.params.id).then(() => {
        res.send('Product deleted')
    })
})

app.listen(
    PORT,
    () => console.log(`Server is running on port ${PORT}`)
)
