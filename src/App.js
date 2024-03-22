import './App.css';
import { useState, useEffect } from 'react';

function App() {

  const [products, setProducts] = useState([]);

  const url = "http://localhost:3000/products";

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    };
    
    fetchData();
  }, []);

  console.log(products);

  return (
    <div className="App">
      <h1>Product List</h1>
    </div>
  );
}

export default App;
