package com.study.study.domain.user;

import jakarta.persistence.Column;
import lombok.Getter;

@Getter
public class UserDto {
    private Long id;
    private String sub;
    private String email;
    private String username;

    public UserDto(Long id, String sub, String email, String username) {
        this.id = id;
        this.sub = sub;
        this.email = email;
        this.username = username;
    }

    public static UserDto of(User user){
        return new UserDto(
                user.getId(),
                user.getSub(),
                user.getEmail(),
                user.getUsername()
        );
    }
}

