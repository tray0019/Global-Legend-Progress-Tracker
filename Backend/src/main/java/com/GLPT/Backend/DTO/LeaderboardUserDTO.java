package com.GLPT.Backend.DTO;

import com.GLPT.Backend.Entity.Rank;

public record LeaderboardUserDTO(
        Long id,              // Added this!
        String firstName,
        String lastName,
        int totalXP,
        Rank currentRank
) {}