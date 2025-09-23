package com.study.study.jwk.dto;

import lombok.Data;
import lombok.Getter;

@Getter
public class SimpleJwk {
    private String kid;
    private String kty;
    private String alg;
    private String n;
    private String e;

}
