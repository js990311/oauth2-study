package com.study.study.jwk.dto;

import lombok.Data;

import java.util.List;

@Data
public class SimpleJwks {
    private List<SimpleJwk> keys;
}
