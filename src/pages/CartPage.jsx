// 📁 src/pages/CartPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';

function CartPage({ cartItems, setCartItems, updateQuantity, clearCart }) {
  const navigate = useNavigate();

  // ✅ 미리 고정된 메뉴 3개
  const menus = [
    { id: 1, name: '아메리카노', price: 4000 },
    { id: 2, name: '카페라떼', price: 4500 },
    { id: 3, name: '망고스무디', price: 5000 },
  ];

  // ✅ 메뉴 추가 버튼 눌렀을 때 처리
  const handleAddMenu = (menu) => {
    const existingItem = cartItems.find((item) => item.name === menu.name);

    if (existingItem) {
      updateQuantity(existingItem.id, 1); // 이미 있으면 수량 +1
    } else {
      const newItem = {
        id: Date.now(), // 고유 ID
        name: menu.name,
        price: menu.price,
        quantity: 1,
      };
      setCartItems((prev) => [...prev, newItem]);
    }
  };

  // ✅ 주문하기 눌렀을 때 처리
  const handleCheckout = async () => {
    // 👉 총 금액이 0이면 결제 못하게 막기
    if (totalPrice <= 0) {
      alert('총 금액이 0원입니다. 메뉴를 추가하세요.');
      return;
    }

    try {
      const orderItems = cartItems.map((item) => ({
        menuId: item.id,
        quantity: item.quantity,
      }));

      const token = localStorage.getItem('adminToken');

      const res = await api.post(
        '/api/orders',
        { items: orderItems },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const { orderId } = res.data;
      sessionStorage.setItem('orderId', orderId);

      // ✅ 결제 페이지로 이동할 때 totalPrice 같이 넘기기
      //navigate(`/payment/${orderId}?totalAmount=${totalPrice}`);
      navigate(`/payment/${Number(orderId)}?totalAmount=${Number(totalPrice)}`);
    } catch (err) {
      console.error('❌ 주문 생성 실패:', err);
      alert('주문 생성 실패');
    }
  };

  // ✅ 총 금액 계산
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🛒 장바구니</h2>

      {/* 메뉴 추가 버튼들 */}
      <div className="space-y-2 mb-6">
        {menus.map((menu) => (
          <button
            key={menu.id}
            onClick={() => handleAddMenu(menu)}
            className="block bg-purple-500 text-white px-4 py-2 rounded w-full"
          >
            ➕ {menu.name} ({menu.price.toLocaleString()}원) 추가
          </button>
        ))}
      </div>

      {/* 장바구니 */}
      {cartItems.length === 0 ? (
        <p className="text-gray-500">장바구니가 비어 있습니다.</p>
      ) : (
        <ul className="space-y-4">
          {cartItems.map((item) => (
            <li key={item.id} className="border p-4 rounded shadow">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.price.toLocaleString()}원 × {item.quantity}개
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="bg-green-400 text-white px-2 rounded"
                  >
                    ➕
                  </button>
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="bg-red-400 text-white px-2 rounded"
                  >
                    ➖
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* 총 금액 및 버튼 */}
      <div className="mt-6">
        <h3 className="text-lg font-bold">
          총 금액: {totalPrice.toLocaleString()}원
        </h3>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleCheckout}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            💳 주문하기
          </button>
          <button
            onClick={clearCart}
            className="bg-gray-500 text-white px-4 py-2 rounded w-full"
          >
            ❌ 비우기
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
