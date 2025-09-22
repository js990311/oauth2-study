package com.study.study.controller;

import com.study.study.service.TokenValidationService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api")
@RestController
public class TokenController {
    private final TokenValidationService tokenValidationService;

    /**
     * AccessToken을 header로 받아서 처리하는 api입니다
     * @return
     */
    @GetMapping("/login")
    public ResponseEntity<?> getLogin(@RequestHeader("Authorization") String authorization){
        log.info("[/api/login] 로그인");
        if(authorization == null || !authorization.startsWith("Bearer ")){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "token not found"));
        }
        try{
            tokenValidationService.validate(authorization.substring(7));
            return ResponseEntity.status(HttpStatus.OK).body(Map.of("token", "asdf"));
        }catch (Exception ex){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "token validation fail"));
        }
    }
}
