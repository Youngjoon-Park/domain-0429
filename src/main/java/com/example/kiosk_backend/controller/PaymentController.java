package com.example.kiosk_backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.kiosk_backend.dto.KakaoReadyResponse;
import com.example.kiosk_backend.dto.PaymentApproveRequest;
import com.example.kiosk_backend.dto.PaymentRequest;
import com.example.kiosk_backend.service.PaymentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // ✅ 결제 준비
    @PostMapping("/ready")
    public KakaoReadyResponse readyToPay(@RequestBody PaymentRequest request) {
        System.out.println("✅ 받은 orderId: " + request.getOrderId());
        System.out.println("✅ 받은 totalAmount: " + request.getTotalAmount());

        Long orderId = request.getOrderId();
        Integer totalAmount = request.getTotalAmount();

        if (orderId == null || totalAmount == null) {
            throw new IllegalArgumentException("orderId 또는 totalAmount가 누락되었습니다.");
        }

        if (totalAmount <= 0) {
            throw new IllegalArgumentException("결제 금액이 0원 이상이어야 합니다.");
        }

        System.out.println("✅ 요청받은 orderId: " + orderId);
        System.out.println("✅ 요청받은 totalAmount: " + totalAmount);

        return paymentService.kakaoPayReady(orderId, totalAmount);
    }

    // ✅ 결제 승인 (pg_token, orderId 받아서)
    @PostMapping("/approve")
    public String approvePayment(@RequestBody PaymentApproveRequest request) {
        paymentService.kakaoPayApprove(request.getPgToken(), request.getOrderId());
        return "결제 승인 완료"; // ✅ 프론트로 이 문구만 리턴
    }
}
