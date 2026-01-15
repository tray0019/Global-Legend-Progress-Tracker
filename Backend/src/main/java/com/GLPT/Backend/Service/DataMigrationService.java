package com.GLPT.Backend.Service;

import com.GLPT.Backend.Entity.Goal;
import com.GLPT.Backend.Entity.User;
import com.GLPT.Backend.Repository.GoalRepository;
import com.GLPT.Backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DataMigrationService {

    private final UserRepository userRepository;
    private final GoalRepository goalRepository;

    @Autowired
    public DataMigrationService(UserRepository userRepository, GoalRepository goalRepository){
        this.userRepository = userRepository;
        this.goalRepository = goalRepository;
    }

    public void migrateGoalsToUser(String email, List<Goal> legacyGoals){
        // 1. Find the user by email
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        // 2. Assign legacy goals to this user
        for (Goal goal : legacyGoals){
            goal.setUser(user);
            goalRepository.save(goal);
        }

        System.out.println("Migrated " + legacyGoals.size() + " goals to user " + email);
    }
}
