package com.GLPT.Backend.DTO;

import com.GLPT.Backend.Entity.Gender;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public class CompletedProfileRequest {

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    private LocalDate birthDate;

    @NotBlank
    private Gender gender;
}
