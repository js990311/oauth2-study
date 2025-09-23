package com.study.study.jwk.dto;

import lombok.Data;

import java.util.List;
import java.util.Optional;

@Data
public class SimpleJwks {
    private List<SimpleJwk> keys;

    public Optional<SimpleJwk> findKey(String keyId){
        for(SimpleJwk key: keys){
            if(key.getKid().equals(keyId)){
                return Optional.of(key);
            }
        }
        return Optional.empty();
    }
}
