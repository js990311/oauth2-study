package com.study.study.service;

import com.auth0.jwk.*;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.study.study.jwk.dto.SimpleJwk;
import com.study.study.jwk.dto.SimpleJwks;
import com.study.study.jwk.exception.CustomTokenException;
import com.study.study.jwk.provider.SimpleJwkProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.PublicKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class TokenValidationService {
    private final String issuerUri;
    private final JwkProvider jwkProvider;
    private final SimpleJwkProvider simpleJwkProvider;

    public DecodedJWT validate(String token) {
        DecodedJWT decodedToken = JWT.decode(token);
        try{
            SimpleJwks simpleJwks = simpleJwkProvider.get();
            Optional<SimpleJwk> opt = simpleJwks.findKey(decodedToken.getKeyId());
            SimpleJwk key = opt.orElseThrow(() -> {
                throw new RuntimeException("INVALID KeyId");
            });
            PublicKey publicKey = key.getPublicKey();
            if(key.getAlg().equals("RS256")){
                Algorithm algorithm = Algorithm.RSA256((RSAPublicKey) publicKey, null);
                return JWT.require(algorithm)
                        .withIssuer(issuerUri)
                        .build()
                        .verify(token);
            }else {
                throw new Exception("UNSUPPORTED ALGORITHM");
            }
        }catch (TokenExpiredException ex){
            throw new CustomTokenException("TOKEN EXPIRED", 42);
        } catch (Exception e){
            throw new RuntimeException(e);
        }
    }
}
