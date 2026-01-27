package com.GLPT.Backend.config;

import com.GLPT.Backend.Entity.User;
import com.GLPT.Backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String email = oAuth2User.getAttribute("email");

        userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFirstName(oAuth2User.getAttribute("given_name"));
            newUser.setLastName(oAuth2User.getAttribute("family_name"));
            newUser.setProfileCompleted(false);

            // ADD THESE TWO LINES
            newUser.setProvider("GOOGLE");
            newUser.setProviderUserId(oAuth2User.getAttribute("sub")); // Unique ID from Google

            return userRepository.save(newUser);
        });

        return oAuth2User;
    }
}