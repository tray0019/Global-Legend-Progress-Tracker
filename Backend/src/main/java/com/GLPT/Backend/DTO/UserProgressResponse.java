package com.GLPT.Backend.DTO;

import com.GLPT.Backend.Entity.Rank;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class UserProgressResponse {

    private int totalXP;
    private int dailyXP;
    private Rank currentRank;
    private LocalDate lastActivityDate;



}
