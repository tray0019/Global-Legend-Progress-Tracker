package com.GLPT.Backend.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class GoalWithEntriesDto {

    private long goalId;
    private String goalTitle;
    private List<EntryResponseDto> entryDescription;

}
