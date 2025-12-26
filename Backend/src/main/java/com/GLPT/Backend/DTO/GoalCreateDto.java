package com.GLPT.Backend.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GoalCreateDto {

    @NotBlank(message="Title is mandatory")
    private String goalTitle;

    private Integer difficulty;

}
