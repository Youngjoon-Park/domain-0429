// 📁 src/pages/PaymentSuccessPage.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axiosInstance';

function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('결제 승인 중...');

  useEffect(() => {
    const pgToken = searchParams.get('pg_token');
    const orderId = sessionStorage.getItem('orderId');

    if (!pgToken || !orderId) {
      setMessage('❌ 결제 정보가 없습니다.');
      return;
    }

    // ✅ 결제 승인 요청
    const approvePayment = async () => {
      try {
        await api.post('/api/payment/approve', {
          pgToken: pgToken,
          orderId: orderId,
        });
        sessionStorage.removeItem('orderId'); // ✅ 추가: 결제 승인 후 주문번호 제거
        setMessage('✅ 결제가 완료되었습니다!');
      } catch (err) {
        console.error('❌ 결제 승인 실패:', err);
        setMessage('❌ 결제 승인에 실패했습니다.');
      }
    };

    approvePayment();
  }, [searchParams]);

  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">{message}</h2>
      <p>이용해 주셔서 감사합니다.</p>
    </div>
  );
}

export default PaymentSuccessPage;
