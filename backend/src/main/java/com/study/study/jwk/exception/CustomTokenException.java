package com.study.study.jwk.exception;

import lombok.Getter;

@Getter
public class CustomTokenException extends RuntimeException{
    private Integer code;
    private String message;

    public CustomTokenException(String message, Integer code) {
        super(message);
        this.code = code;
        this.message = message;
    }
}
