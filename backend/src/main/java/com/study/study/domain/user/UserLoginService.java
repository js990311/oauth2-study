package com.study.study.domain.user;

import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class UserLoginService {
    private final UserRepository userRepository;

    @Transactional
    public UserDto login(DecodedJWT token){
        Optional<User> opt = userRepository.findBySub(token.getSubject());
        if(opt.isEmpty()){
            User user = User.builder()
                    .sub(token.getSubject())
                    .email(token.getClaim("email").asString())
                    .build();
            user = userRepository.save(user);

            return UserDto.of(user);
        }else {
            return UserDto.of(opt.get());
        }
    }
}
