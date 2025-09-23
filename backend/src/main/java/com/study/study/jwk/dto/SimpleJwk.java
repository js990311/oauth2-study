package com.study.study.jwk.dto;

import lombok.Data;
import lombok.Getter;

import java.math.BigInteger;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.RSAPublicKeySpec;
import java.util.Base64;

@Getter
public class SimpleJwk {
    private String kid;
    private String kty;
    private String alg;
    private String n;
    private String e;
    private PublicKey publicKey;

    public PublicKey getPublicKey() throws NoSuchAlgorithmException, InvalidKeySpecException {
        if(publicKey != null){
            return publicKey;
        }
        byte[] nb = Base64.getUrlDecoder().decode(n);
        byte[] eb = Base64.getUrlDecoder().decode(e);

        BigInteger ni = new BigInteger(1, nb);
        BigInteger ei = new BigInteger(1, eb);

        RSAPublicKeySpec spec = new RSAPublicKeySpec(ni, ei);

        KeyFactory factory = KeyFactory.getInstance(kty);
        publicKey = factory.generatePublic(spec);
        return publicKey;
    }
}
