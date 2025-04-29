package com.example.kiosk_backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequest {
    private Long orderId;
    // private int totalAmount; // ✅ 추가
    private Integer totalAmount;// 핵심 에러의 주범
    // getter, setter 또는 lombok @Data, @Getter 등 사용
}
