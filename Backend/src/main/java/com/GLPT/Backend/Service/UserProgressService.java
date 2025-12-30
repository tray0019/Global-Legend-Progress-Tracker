package com.GLPT.Backend.Service;

import com.GLPT.Backend.Entity.UserProgress;
import com.GLPT.Backend.Repository.UserProgressRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class UserProgressService {

    private final UserProgressRepository repository;

    public UserProgressService(UserProgressRepository repository){
        this.repository = repository;
    }

    public void addXP(int difficulty){
        UserProgress progress = repository.findTopByOrderByIdAsc();

        int xpToAdd = calculateXP(difficulty);

        progress.setTotalXP(progress.getTotalXP()+xpToAdd);
        progress.setLastActivityDate(LocalDate.now());

        repository.save(progress);

    }

    private int calculateXP(int difficulty){
        return switch (difficulty){
            case 1 -> 10;
            case 2 -> 25;
            case 3 -> 50;
            default -> throw new IllegalArgumentException("Invalid difficulty: "+difficulty);
        };
    }
}
