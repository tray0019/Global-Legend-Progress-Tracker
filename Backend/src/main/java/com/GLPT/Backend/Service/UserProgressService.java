package com.GLPT.Backend.Service;

import com.GLPT.Backend.Entity.Rank;
import com.GLPT.Backend.Entity.UserProgress;
import com.GLPT.Backend.Repository.UserProgressRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
public class UserProgressService {

    private final UserProgressRepository repository;

    public UserProgressService(UserProgressRepository repository){
        this.repository = repository;
    }

    private static final int DAILY_XP_CAP = 250;
    private static final int DECAY_START_DAYS = 25;
    private static final int DECAY_INTERVAL_DAYS = 14;

    public void addXP(int difficulty){
        UserProgress progress = repository.findTopByOrderByIdAsc();

        resetDailyXPIfNewDay(progress);

        int xpToAdd = calculateXP(difficulty);
        int remainingXP = DAILY_XP_CAP - progress.getDailyXP();

        if(remainingXP <= 0){
            return;
        }

        int finalXP = Math.min(xpToAdd, remainingXP);

        int newTotalXP = progress.getTotalXP() + finalXP;

        progress.setTotalXP(newTotalXP);
        progress.setDailyXP(progress.getDailyXP()+finalXP);
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

    private void resetDailyXPIfNewDay(UserProgress progress){
        if(!LocalDate.now().equals(progress.getLastActivityDate())){
            progress.setDailyXP(0);
        }
    }

    private int daysInactive(UserProgress progress){
        return (int) ChronoUnit.DAYS.between(
                progress.getLastActivityDate(),
                LocalDate.now()
        );
    }

    private Rank calculateDecayedRank(UserProgress progress){
        int inactiveDays = daysInactive(progress);

        if(inactiveDays < DECAY_START_DAYS){
            return progress.getCurrentRank();
        }

        int decaySteps = 1 +(inactiveDays - DECAY_START_DAYS) /DECAY_INTERVAL_DAYS;

        int currentOrdinal = progress.getCurrentRank().ordinal();
        int newOrdinal = Math.max(0, currentOrdinal -decaySteps);

        return Rank.values()[newOrdinal];
    }

    public void applyRankDecayIfNeeded(){
        UserProgress progress = repository.findTopByOrderByIdAsc();
        Rank decayedRank = calculateDecayedRank(progress);

        if(decayedRank != calculateDecayedRank(progress)){
            progress.setCurrentRank(decayedRank);
            repository.save(progress);
        }
    }

}
