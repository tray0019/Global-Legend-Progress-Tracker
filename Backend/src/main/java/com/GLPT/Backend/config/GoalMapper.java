package com.GLPT.Backend.config;

import com.GLPT.Backend.DTO.EntryResponseDto;
import com.GLPT.Backend.DTO.GoalCheckDto;
import com.GLPT.Backend.DTO.GoalResponseDto;
import com.GLPT.Backend.DTO.GoalWithEntriesDto;
import com.GLPT.Backend.Entity.Goal;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class GoalMapper {

    public GoalResponseDto toResponse(Goal goal) {
        return new GoalResponseDto(
                goal.getId(),
                goal.getGoalTitle(),
                goal.getDifficulty().getValue(),
                goal.getPosition(),
                goal.getStatus(),
                goal.isArchived()
        );
    }

    public GoalWithEntriesDto toDetails(Goal goal) {
        List<EntryResponseDto> entries = goal.getEntries().stream()
                .map(e -> new EntryResponseDto(e.getId(), e.getDescription()))
                .toList();

        List<GoalCheckDto> checks = goal.getChecks() == null
                ? List.of()
                : goal.getChecks().stream()
                .map(c -> new GoalCheckDto(c.getCheckDate()))
                .toList();

        Long userId = goal.getUser() != null ? goal.getUser().getId() : null;
        String userName = goal.getUser() != null
                ? ((goal.getUser().getFirstName() != null ? goal.getUser().getFirstName() : "") +
                " " +
                (goal.getUser().getLastName() != null ? goal.getUser().getLastName() : "")).trim()
                : null;

        return new GoalWithEntriesDto(
                goal.getId(),
                goal.getGoalTitle(),
                entries,
                checks,
                userId,
                userName
        );
    }
}

