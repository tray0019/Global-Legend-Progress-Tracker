package com.GLPT.Backend.DTO;

import com.GLPT.Backend.Entity.Difficulty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class GoalResponseDto {

    private long id;
    private String goalTitle;
    private int difficulty;
    private boolean archive;
    private int position;

}
