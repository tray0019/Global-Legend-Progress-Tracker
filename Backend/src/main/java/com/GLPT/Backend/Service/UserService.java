package com.GLPT.Backend.Service;

import com.GLPT.Backend.DTO.*;
import com.GLPT.Backend.Entity.Goal;
import com.GLPT.Backend.Entity.User;
import com.GLPT.Backend.Repository.GoalRepository;
import com.GLPT.Backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final GoalRepository goalRepository;

    @Value("${app.minAge:13}")//This allows changing it without recompiling.
    private int MIN_AGE;

    @Autowired
    public UserService(UserRepository userRepository, GoalRepository goalRepository){
        this.userRepository = userRepository;
        this.goalRepository = goalRepository;
    }

    public User registerOrLoginOAuthUser(UserRegistrationRequest request) {
        Optional<User> existing = userRepository.findByEmail(request.getEmail());
        if (existing.isPresent()) {
            return existing.get(); // log in existing user
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setProvider(request.getProvider());
        user.setProviderUserId(request.getProviderUserId());
        user.setProfileCompleted(false);

        return userRepository.save(user);
    }


    private void validateAge(LocalDate birthDate){
        int age = Period.between(birthDate, LocalDate.now()).getYears();
        if(age < MIN_AGE){
            throw new IllegalArgumentException("You must be at least 13 years old to sign up.");
        }
    }

    public User completeProfile(Long userId, CompleteProfileRequest request){
        User user = userRepository.findById(userId)
                .orElseThrow(()->new RuntimeException("User not found"));

        validateAge(request.getBirthDate());

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setBirthDate(request.getBirthDate());
        user.setGender(request.getGender());
        user.setProfileCompleted(true);

        return userRepository.save(user);
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<GoalWithEntriesDto> getUserGoalsWithEntries(Long userId) {

        return userRepository.findGoalsWithEntriesByUserId(userId)
                .stream()
                .map(goal -> {

                    // map entries
                    List<EntryResponseDto> entryDtos = goal.getEntries().stream()
                            .map(entry -> new EntryResponseDto(
                                    entry.getId(),
                                    entry.getDescription()
                            ))
                            .toList();

                    // map checks
                    List<GoalCheckDto> checkDtos = goal.getChecks().stream()
                            .map(check -> new GoalCheckDto(check.getCheckDate()))
                            .toList();

                    // map user info
                    long uId = goal.getUser().getId();
                    String uName = (goal.getUser().getFirstName() != null ? goal.getUser().getFirstName() : "") +
                            " " +
                            (goal.getUser().getLastName() != null ? goal.getUser().getLastName() : "");

                    return new GoalWithEntriesDto(
                            goal.getId(),
                            goal.getGoalTitle(),
                            entryDtos,
                            checkDtos,
                            uId,
                            uName.trim()
                    );

                })
                .toList();
    }

    public Goal viewGoalForUser(long goalId, User user) {
        return goalRepository.findByIdAndUser(goalId, user)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.FORBIDDEN, "Not your goal"));
    }



}
