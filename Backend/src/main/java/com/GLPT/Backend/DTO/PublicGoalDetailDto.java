package com.GLPT.Backend.DTO;

import java.time.LocalDate;
import java.util.List;

public record PublicGoalDetailDto(
        Long id,
        String title,
        Integer position,
        List<LocalDate> checkDates // Just the dates of the checks
) {}
