// ❤️ 파일: src/main/java/com/example/kiosk_backend/controller/OrderController.java

package com.example.kiosk_backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    @PostMapping
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> orderRequest) {
        // 가장 간단한 방식: orderId 만들어서 반환

        // 가장 간조하게 orderId 123L 정해서 반환 (일반적인 예제)
        Long orderId = 123L;

        return ResponseEntity.ok(Map.of("orderId", orderId));
    }
}
