package com.GLPT.Backend.Service;

import com.GLPT.Backend.Entity.Rank;
import com.GLPT.Backend.Entity.User;
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

        if(remainingXP <= 0) return;

        int finalXP = Math.min(xpToAdd, remainingXP);

        progress.setTotalXP(progress.getTotalXP() + finalXP);
        progress.setDailyXP(progress.getDailyXP() + finalXP);
        progress.setLastActivityDate(LocalDate.now());

        Rank newRank = calculateRankFromXP(progress.getTotalXP());
        progress.setCurrentRank(newRank);

        System.out.println(progress.getTotalXP());
        System.out.println(progress.getCurrentRank());

        repository.save(progress);
    }

    // ==== USER-SCOPE (Phase 2+) ====
    public void addXPForUser(int difficulty, User user) {
        UserProgress progress = repository.findByUser(user)
                .orElseThrow(() -> new IllegalStateException("UserProgress not found"));

        resetDailyXPIfNewDay(progress);

        int xpToAdd = calculateXP(difficulty);
        int remainingXP = DAILY_XP_CAP - progress.getDailyXP();

        if (remainingXP <= 0) return;

        int finalXP = Math.min(xpToAdd, remainingXP);

        progress.setTotalXP(progress.getTotalXP() + finalXP);
        progress.setDailyXP(progress.getDailyXP() + finalXP);
        progress.setLastActivityDate(LocalDate.now());

        Rank newRank = calculateRankFromXP(progress.getTotalXP());
        progress.setCurrentRank(newRank);

        repository.save(progress);
    }


    private int calculateXP(int difficulty){
        return switch (difficulty){
            case 1 -> 10;
            case 2 -> 25;
            case 3 -> 50;
            default -> throw new IllegalArgumentException("Invalid difficulty: " + difficulty);
        };
    }


    private Rank calculateRankFromXP(int totalXP){
        if(totalXP >= 24000) return Rank.CHALLENGER;
        if(totalXP >= 14000) return Rank.MASTER;
        if(totalXP >= 8000) return Rank.DIAMOND;
        if(totalXP >= 4800) return Rank.PLATINUM;
        if(totalXP >= 2400) return Rank.GOLD;
        if(totalXP >= 800) return Rank.SILVER;
        if(totalXP >= 200) return Rank.BRONZE;
        System.out.print("Total XP:"+totalXP);
        return Rank.UNRANKED;
    }

    private void resetDailyXPIfNewDay(UserProgress progress){
        LocalDate today = LocalDate.now();
        if(!today.equals(progress.getLastActivityDate())){
            progress.setDailyXP(0);
            progress.setLastActivityDate(today); // ✅ update last activity
            repository.save(progress);
        }
    }

    // ==== USER-SCOPE (Phase 2+) ====

    private int daysInactive(UserProgress progress){
        return (int) ChronoUnit.DAYS.between(progress.getLastActivityDate(), LocalDate.now());
    }

    // ==== USER-SCOPE (Phase 2+) ====

    private Rank calculateDecayedRank(UserProgress progress){
        int inactiveDays = daysInactive(progress);

        if(inactiveDays < DECAY_START_DAYS){
            return progress.getCurrentRank();
        }

        int decaySteps = 1 + (inactiveDays - DECAY_START_DAYS) / DECAY_INTERVAL_DAYS;

        int newOrdinal = Math.max(0, progress.getCurrentRank().ordinal() - decaySteps);
        return Rank.values()[newOrdinal];
    }

    // ==== USER-SCOPE (Phase 2+) ====


    public void applyRankDecayIfNeeded(){
        UserProgress progress = repository.findTopByOrderByIdAsc();
        Rank decayedRank = calculateDecayedRank(progress);

        if(decayedRank != progress.getCurrentRank()){
            progress.setCurrentRank(decayedRank);
            repository.save(progress);
        }
    }

    private void applyRankDecayIfNeeded(UserProgress progress) {
        Rank decayedRank = calculateDecayedRank(progress);

        if (decayedRank != progress.getCurrentRank()) {
            progress.setCurrentRank(decayedRank);
            repository.save(progress);
        }
    }


    // ==== USER-SCOPE (Phase 2+) ====

    public UserProgress getProgressWithDecayCheck(){
        UserProgress progress = repository.findTopByOrderByIdAsc();

        // 1️⃣ Reset daily XP if new day
        resetDailyXPIfNewDay(progress);

        // 2️⃣ Apply rank decay if needed
        applyRankDecayIfNeeded();

        return progress;
    }

    // ==== USER-SCOPE (Phase 2+) ====
    public UserProgress getProgressWithDecayCheckForUser(User user) {
        // 1. Try to find existing progress, if not found, CREATE a new one!
        UserProgress progress = repository.findByUser(user)
                .orElseGet(() -> {
                    UserProgress newProgress = new UserProgress();
                    newProgress.setUser(user);
                    newProgress.setTotalXP(0);
                    newProgress.setDailyXP(0);
                    newProgress.setCurrentRank(Rank.BRONZE); // Or your lowest rank
                    newProgress.setLastActivityDate(LocalDate.now());
                    return repository.save(newProgress);
                });

        // 2. Now that we definitely have a progress object, run your checks
        resetDailyXPIfNewDay(progress);
        applyRankDecayIfNeeded(progress);

        return progress;
    }


    public void removeXP(int difficulty){
        UserProgress progress = repository.findTopByOrderByIdAsc();

        int xpToSubtract = calculateXP(difficulty);

        // Subtract XP but never go below 0
        progress.setTotalXP(Math.max(0, progress.getTotalXP() - xpToSubtract));
        progress.setDailyXP(Math.max(0, progress.getDailyXP() - xpToSubtract));
        progress.setLastActivityDate(LocalDate.now());

        // Update rank based on new totalXP
        Rank newRank = calculateRankFromXP(progress.getTotalXP());
        progress.setCurrentRank(newRank);

        repository.save(progress);
    }

    // ==== USER-SCOPE (Phase 2+) ====
    public void removeXPForUser(int difficulty, User user) {
        UserProgress progress = repository.findByUser(user)
                .orElseThrow(() -> new IllegalStateException("UserProgress not found"));

        int xpToSubtract = calculateXP(difficulty);

        progress.setTotalXP(Math.max(0, progress.getTotalXP() - xpToSubtract));
        progress.setDailyXP(Math.max(0, progress.getDailyXP() - xpToSubtract));
        progress.setLastActivityDate(LocalDate.now());

        Rank newRank = calculateRankFromXP(progress.getTotalXP());
        progress.setCurrentRank(newRank);

        repository.save(progress);
    }


}
