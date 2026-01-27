package com.GLPT.Backend.Controller;

import com.GLPT.Backend.DTO.LeaderboardUserDTO;
import com.GLPT.Backend.Repository.UserProgressRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class LeaderboardController {

    private final UserProgressRepository progressRepository;

    public LeaderboardController(UserProgressRepository progressRepository) {
        this.progressRepository = progressRepository;
    }

    @GetMapping("/global")
    public List<LeaderboardUserDTO> getGlobalLeaderboard() {
        // This calls the query we planned in the Repository
        return progressRepository.getGlobalLeaderboard();
    }
}