package com.GLPT.Backend.DTO;

import com.GLPT.Backend.Entity.*;
import jakarta.persistence.*;

import java.util.List;

public record UserProfileDto(
        Long id,
        String firstName,
        String lastName,
        String rank,
        int totalXp,
        int followersCount,
        int followingCount,
        boolean isFollowing,
        List<PublicGoalDetailDto> goals, // Detailed list
        List<GlobalContributionDto> calendarData // For the heat map
) {}