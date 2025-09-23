package com.study.study.jwk.provider;


import com.google.gson.Gson;
import com.study.study.jwk.dto.SimpleJwk;
import com.study.study.jwk.dto.SimpleJwks;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

@RequiredArgsConstructor
@Component
public class SimpleJwkProvider {
    private final String issuerUri;
    private final WebClient webClient;

    public SimpleJwks get(){
        URL jwksUrl = null;
        try {
            jwksUrl = new URL(issuerUri + "/protocol/openid-connect/certs");
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
        Mono<String> responseMono = webClient.get()
                .uri("/protocol/openid-connect/certs")
                .retrieve()
                .bodyToMono(String.class);
        String response = responseMono.block();
        Gson gson = new Gson();
        SimpleJwks simpleJwks = gson.fromJson(response, SimpleJwks.class);
        return simpleJwks;
    }
}
