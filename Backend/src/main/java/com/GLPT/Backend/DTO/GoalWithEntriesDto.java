package com.GLPT.Backend.DTO;

import com.GLPT.Backend.Entity.ProgressEntry;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class GoalWithEntriesDto {

    private long goalId;
    private String goalTitle;
    private List<EntryResponseDto> entries;

    private List<GoalCheckDto> checks;   // ✅ add goal checks

    // just the info you need for the goal owner
    private long userId;
    private String userName;

}
