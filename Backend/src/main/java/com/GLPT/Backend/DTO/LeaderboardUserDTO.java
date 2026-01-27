package com.GLPT.Backend.DTO;

import com.GLPT.Backend.Entity.Rank;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LeaderboardUserDTO {
    private String firstName;
    private String lastName;
    private int totalXP;
    private Rank currentRank;
}