package com.GLPT.Backend.Service;

import com.GLPT.Backend.Entity.Rank;
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
        int newTotalXP = progress.getTotalXP() + xpToAdd;

        progress.setTotalXP(newTotalXP);
        progress.setLastActivityDate(LocalDate.now());

        Rank newRank = calculateRankFromXP(newTotalXP);

        if(newRank.ordinal() > progress.getCurrentRank().ordinal()){
            progress.setCurrentRank(newRank);
        }

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

    private Rank calculateRankFromXP(int totalXP){
        if(totalXP >= 6000) return Rank.CHALLENGER;
        if(totalXP >= 3500) return Rank.MASTER;
        if(totalXP >= 2000) return Rank.DIAMOND;
        if(totalXP >= 1200) return Rank.PLATINUM;
        if(totalXP >= 600) return Rank.GOLD;
        if(totalXP >= 200) return Rank.SILVER;
        return Rank.BRONZE;
    }
}
