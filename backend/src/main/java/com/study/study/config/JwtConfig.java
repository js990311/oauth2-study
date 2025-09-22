package com.study.study.config;

import com.auth0.jwk.JwkProvider;
import com.auth0.jwk.JwkProviderBuilder;
import com.study.study.service.TokenValidationService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.concurrent.TimeUnit;

@Configuration
public class JwtConfig {
    private final String issuerUri = "http://localhost:8083/realms/master";

    @Bean
    public JwkProvider jwkProvider() {
        URL jwksUrl = null;
        try {
            jwksUrl = new URL(issuerUri + "/protocol/openid-connect/certs");
        } catch (MalformedURLException e) {
            throw new RuntimeException(e);
        }
        return new JwkProviderBuilder(jwksUrl)
                .cached(10,24, TimeUnit.HOURS)
                .rateLimited(10, 1, TimeUnit.MINUTES)
                .build();
    }

    @Bean
    public TokenValidationService tokenValidationService(){
        return new TokenValidationService(issuerUri, jwkProvider());
    }
}
