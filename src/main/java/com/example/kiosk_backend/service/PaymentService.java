package com.example.kiosk_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.kiosk_backend.dto.KakaoReadyResponse;

@Service
public class PaymentService {

    private final WebClient webClient;
    private String tid;

    @Value("${kakao.cid}")
    private String kakaoCid;

    @Value("${kakao.approve-url}")
    private String kakaoApproveUrl;

    @Value("${kakao.cancel-url}")
    private String kakaoCancelUrl;

    @Value("${kakao.fail-url}")
    private String kakaoFailUrl;

    // WebClient 생성자에서 기본 설정
    public PaymentService(@Value("${kakao.admin-key}") String kakaoAdminKey) {
        this.webClient = WebClient.builder()
                .baseUrl("https://kapi.kakao.com")
                .defaultHeader("Authorization", "KakaoAK " + kakaoAdminKey)
                .defaultHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")
                .build();
    }

    // 결제 준비 (Ready)
    public KakaoReadyResponse kakaoPayReady(Long orderId, int totalAmount) {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", kakaoCid);
        params.add("partner_order_id", "order_" + orderId);
        params.add("partner_user_id", "user_" + orderId);
        params.add("item_name", "테스트 상품");
        params.add("quantity", "1");
        params.add("total_amount", String.valueOf(totalAmount)); // 🔥 수정
        params.add("tax_free_amount", "0");
        params.add("approval_url", kakaoApproveUrl);
        params.add("cancel_url", kakaoCancelUrl);
        params.add("fail_url", kakaoFailUrl);

        System.out.println("✅ 카카오 요청 파라미터: " + params); // 🔍 디버깅용

        KakaoReadyResponse response = webClient.post()
                .uri("/v1/payment/ready")
                .body(BodyInserters.fromFormData(params))
                .retrieve()
                .bodyToMono(KakaoReadyResponse.class)
                .doOnError(error -> System.out.println("❌ 결제 준비 오류: " + error.getMessage()))
                .block();

        this.tid = response.getTid();
        return response;
    }

    // 결제 승인 (Approve)
    public void kakaoPayApprove(String pgToken, Long orderId) {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", kakaoCid);
        params.add("tid", this.tid);
        params.add("partner_order_id", "order_" + orderId);
        params.add("partner_user_id", "user_" + orderId);
        params.add("pg_token", pgToken);

        webClient.post()
                .uri("/v1/payment/approve")
                .body(BodyInserters.fromFormData(params))
                .retrieve()
                .bodyToMono(String.class)
                .doOnError(error -> System.out.println("❌ 결제 승인 오류: " + error.getMessage()))
                .block();
    }
}
