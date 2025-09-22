package com.study.study.service;

import com.auth0.jwk.*;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URL;
import java.security.interfaces.RSAPublicKey;
import java.util.concurrent.TimeUnit;

@RequiredArgsConstructor
@Service
public class TokenValidationService {
    private final String issuerUri;
    private final JwkProvider jwkProvider;

    public DecodedJWT validate(String token) {
        DecodedJWT decodedToken = JWT.decode(token);
        try{
            Jwk jwk = jwkProvider.get(decodedToken.getKeyId());
            Algorithm algorithm = Algorithm.RSA256((RSAPublicKey) jwk.getPublicKey(), null);
            return JWT.require(algorithm)
                    .withIssuer(issuerUri)
                    .build()
                    .verify(token);
        }catch (Exception e){
            throw new RuntimeException(e);
        }
    }
}
