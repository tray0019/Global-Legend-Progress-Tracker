package com.GLPT.Backend.DTO;

import com.GLPT.Backend.Entity.Difficulty;
import com.GLPT.Backend.Entity.GoalStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GoalResponseDto {

    private long id;
    private String goalTitle;
    private int difficulty;
    private int position;
    private GoalStatus status;

    @Deprecated
    private boolean archive;
}
