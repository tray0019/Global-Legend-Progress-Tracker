package com.GLPT.Backend.DTO;

import com.GLPT.Backend.Entity.Rank;

public record UserSearchDTO(
        Long id,
        String firstName,
        String lastName,
        Rank currentRank,
        int totalXP,
        boolean isFollowing
) {}