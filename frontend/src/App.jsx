import { useEffect, useState } from 'react'
import axios from 'axios'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ShowProduct/>
      <AddProduct/>
    </>
  )
}

const ShowProduct = () =>{
    const [products, setProducts] = useState([])

    const fetchProducts = () =>{
      const data = axios.get('http://localhost:8080/api/v1/products')
      console.log(data);
      return data
    }
    useEffect(() => {
        fetchProducts().then((response) => {
            setProducts(response.data)
        })
    }, [])

    return(
      <div>
        <h1>Products</h1>
        {
          products.length > 0 ? (
            <div>
              {
                products.map((product) => (
                  <div key={product._id}>
                    <h2>Name product: {product.name}</h2>
                    <p>Price: {product.price}</p>
                  </div>
                ))
              }   
            </div>
          ):(
            <p>No products found</p>
          )
        }
      </div>
    )
}

const AddProduct = () =>{
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const addProduct = () =>{
    axios.post('http://localhost:8080/api/v1/products', {
      name: name,
      price: price
    })
    window.location.reload()
  }
  return(
    <div>
    <h1>Add Product</h1>
    <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)}/>
    <input type="number" placeholder="Price" onChange={(e) => setPrice(e.target.value)}/>
    <button onClick={addProduct}>Add Product</button>
  </div>
  )
}

export default App
