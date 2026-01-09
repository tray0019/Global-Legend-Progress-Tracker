package com.GLPT.Backend.DTO;

import com.GLPT.Backend.Entity.Gender;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserRegistrationRequest {
    private String email;
    private String provider; //GOOGLE, APPLE, FACEBOOK
    private String providerUserId; //OAuth "sub" or user ID
}
