package com.GLPT.Backend;

import com.GLPT.Backend.Entity.Goal;
import com.GLPT.Backend.Entity.User;
import com.GLPT.Backend.Repository.GoalRepository;
import com.GLPT.Backend.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MigrationRunner implements CommandLineRunner {

    @Autowired
    private GoalRepository goalRepository;

    @Autowired
    private UserRepository userRepository;

    public MigrationRunner(UserRepository userRepository, GoalRepository goalRepository) {
        this.userRepository = userRepository;
        this.goalRepository = goalRepository;
    }

    @Transactional
    @Override
    public void run(String... args) throws Exception {
        User user = userRepository.findByEmail("tray0019@gmail.com").orElseThrow();

        List<Goal> legacyGoals = goalRepository.findAll();
        System.out.println("Found " + legacyGoals.size() + " legacy goals");

        for (Goal goal : legacyGoals) {
            goal.setUser(user);

            // Safe now because session is open
            if (goal.getEntries() != null) {
                goal.getEntries().forEach(entry -> entry.setGoal(goal));
            }
            if (goal.getChecks() != null) {
                goal.getChecks().forEach(check -> check.setGoal(goal));
            }

            goalRepository.save(goal);
        }

        System.out.println("Migration complete!");
    }
}
