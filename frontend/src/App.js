import React, { useEffect, useState } from "react";
import Axios from "axios";

const App = () =>{
  const [data,setData] = useState("");
  const getData = async() =>  {
    const response = await Axios.get("http://localhost:5000/getData");
    setData(response.data);
  }
  useEffect(()=>{
    getData()
  },[]);


  const menuItems = [
    { id: 1, name: 'Pizza Margherita', price: 25 },
    { id: 2, name: 'Spaghetti Carbonara', price: 30 },
    { id: 3, name: 'Ciorbă de burtă', price: 20 },
    { id: 4, name: 'Desert Tiramisu', price: 15 },
  ];
  
 
    const [cart, setCart] = useState([]);
  
    const addToCart = (item) => {
      setCart([...cart, item]);
    };
  
    const getTotal = () => {
      return cart.reduce((total, item) => total + item.price, 0);
    };
  
  return (
    <div className="min-h-screen p-6 bg-gray-100">
    <h1 className="text-3xl font-bold mb-6">🍕 Restaurant Comenzi</h1>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Meniu</h2>
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.id} className="flex justify-between items-center p-4 bg-white rounded shadow">
              <span>{item.name} - {item.price} lei</span>
              <button
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                onClick={() => addToCart(item)}
              >
                Adaugă
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">🛒 Comanda ta</h2>
        {cart.length === 0 ? (
          <p className="text-gray-500">Niciun produs adăugat încă.</p>
        ) : (
          <ul className="space-y-2">
            {cart.map((item, index) => (
              <li key={index} className="flex justify-between bg-white p-3 rounded shadow">
                <span>{item.name}</span>
                <span>{item.price} lei</span>
              </li>
            ))}
            <li className="font-bold flex justify-between mt-4 border-t pt-2">
              <span>Total:</span>
              <span>{getTotal()} lei</span>
            </li>
          </ul>
        )}
      </div>
    </div>
  </div>
);
}

export default App