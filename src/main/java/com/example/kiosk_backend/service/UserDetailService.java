package com.example.kiosk_backend.service;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.example.kiosk_backend.domain.User;
import com.example.kiosk_backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserDetailService implements UserDetailsService {
    private final UserRepository userRepository;

    // UserRepository의 findByEmail 메소드를 호출하여 email에 해당하는 User를 찾습니다.
    // 해당 이메일의 사용자가 없으면 IllegalArgumentException을 발생시킵니다.
    @Override
    public User loadUserByUsername(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다: " + email));
    }
}
// 로그인할 때, 사용자가 제공한 이름(email)에 해당하는 사용자 정보를 데이터베이스에서 찾아서
// Spring Security에 제공합니다
// 사용자가 제공한 패스워드와 데이터베이스에 저장된 패스워드가 일치하는지 확인합니다.