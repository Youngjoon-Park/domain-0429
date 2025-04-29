import React, { useState } from 'react';
import MainRouter from './routes/MainRouter';

function App() {
  const [cartItems, setCartItems] = useState([]);

  // 메뉴 추가
  const addToCart = (menu) => {
    const existingItem = cartItems.find((item) => item.name === menu.name);

    if (existingItem) {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.name === menu.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      const newItem = {
        id: Date.now(), // 고유 ID
        name: menu.name,
        price: menu.price,
        quantity: 1,
      };
      setCartItems((prevItems) => [...prevItems, newItem]);
    }
  };

  // 수량 변경
  const updateQuantity = (itemId, amount) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // 장바구니 비우기
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <div>
      <MainRouter
        cartItems={cartItems}
        setCartItems={setCartItems}
        addToCart={addToCart}
        updateQuantity={updateQuantity}
        clearCart={clearCart}
      />
    </div>
  );
}

export default App;
