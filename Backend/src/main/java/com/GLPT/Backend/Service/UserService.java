package com.GLPT.Backend.Service;

import com.GLPT.Backend.DTO.CompleteProfileRequest;
import com.GLPT.Backend.DTO.UserRegistrationRequest;
import com.GLPT.Backend.Entity.User;
import com.GLPT.Backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;

@Service
public class UserService {

    private UserRepository userRepository;

    @Value("${app.minAge:13}")//This allows changing it without recompiling.
    private int MIN_AGE;

    @Autowired
    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    public User registerOAuthUser(UserRegistrationRequest request){
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }


        User user = new User();
        user.setEmail(request.getEmail());
        user.setProvider(request.getProvider());
        user.setProviderUserId(request.getProviderUserId());
        user.setProfileCompleted(false);

        System.out.println("New OAuth user created: " + user.getEmail());
        return userRepository.save(user);
    }

    private void validateAge(LocalDate birthDate){
        int age = Period.between(birthDate, LocalDate.now()).getYears();
        if(age < MIN_AGE){
            throw new IllegalArgumentException("You must be at least 13 years old to sign up.");
        }
    }

    public User completeProfile(Long userId, CompleteProfileRequest request){
        User user = userRepository.findById(userId)
                .orElseThrow(()->new RuntimeException("User not found"));

        validateAge(request.getBirthDate());

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setBirthDate(request.getBirthDate());
        user.setGender(request.getGender());
        user.setProfileCompleted(true);

        return userRepository.save(user);
    }

    

}
