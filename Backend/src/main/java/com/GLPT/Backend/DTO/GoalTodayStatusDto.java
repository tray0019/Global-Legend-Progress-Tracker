package com.GLPT.Backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class GoalTodayStatusDto {

    private long goalId;
    private boolean doneToday;
}
