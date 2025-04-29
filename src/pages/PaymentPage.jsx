import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '../api/axiosInstance';

function PaymentPage() {
  const { orderId } = useParams();
  const location = useLocation();
  const [paymentUrl, setPaymentUrl] = useState('');

  useEffect(() => {
    const preparePayment = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const totalAmountRaw = queryParams.get('totalAmount');
        const totalAmount = totalAmountRaw ? Number(totalAmountRaw) : 0;

        if (!orderId || isNaN(totalAmount) || totalAmount <= 0) {
          alert('❌ orderId나 totalAmount가 유효하지 않습니다.');
          return;
        }

        const response = await api.post(
          `/api/payment/ready`,
          {
            orderId: Number(orderId),
            totalAmount: totalAmount, // ✅ 안전하게 변환된 totalAmount 사용
          },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          }
        );

        console.log('✅ 서버 응답 데이터:', response.data);
        const mobileUrl = response.data.next_redirect_mobile_url;

        if (mobileUrl) {
          setPaymentUrl(mobileUrl);
        } else {
          alert('❌ 결제 URL을 가져오지 못했습니다.');
        }
      } catch (err) {
        console.error('❌ 결제 준비 실패:', err);
        alert('❌ 결제 준비에 실패했습니다.');
      }
    };

    if (orderId) {
      preparePayment();
    }
  }, [orderId, location.search]);

  return (
    <div className="p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">💳 결제 준비 중입니다...</h2>
      {paymentUrl ? (
        <div>
          <p className="mb-4">
            📱 아래 QR코드를 휴대폰으로 스캔해서 결제를 진행하세요
          </p>
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
              paymentUrl
            )}`}
            alt="카카오페이 결제 QR코드"
            className="mx-auto"
          />
        </div>
      ) : (
        <p>QR코드를 불러오는 중입니다...</p>
      )}
    </div>
  );
}

export default PaymentPage;
