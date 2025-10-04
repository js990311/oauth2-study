package com.study.study.controller.resp;

import lombok.Getter;

@Getter
public class LoginResponse {
    private Integer code;
    private String message;

    public LoginResponse(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}
