package com.GLPT.Backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class GoalCheckDto {
    private LocalDate date;
}
