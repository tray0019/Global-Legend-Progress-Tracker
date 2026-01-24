package com.GLPT.Backend.Controller;

import com.GLPT.Backend.DTO.UserProgressResponse;
import com.GLPT.Backend.Entity.User;
import com.GLPT.Backend.Entity.UserProgress;
import com.GLPT.Backend.Service.UserProgressService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/progress")
@CrossOrigin(origins = "http://localhost:3000/")
public class UserProgressController {

    private final UserProgressService progressService;

    UserProgressController(UserProgressService progressService){
        this.progressService = progressService;
    }

    private User requireUser(HttpSession session) {
        User user = (User) session.getAttribute("currentUser");

        if (user == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED, "Login required");
        }

        if (!user.isProfileCompleted()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Complete profile first");
        }

        return user;
    }


    @GetMapping
    public UserProgressResponse getResponse(){
        UserProgress progress = progressService.getProgressWithDecayCheck();

        return new UserProgressResponse(
                progress.getTotalXP(),
                progress.getDailyXP(),
                progress.getCurrentRank(),
                progress.getLastActivityDate()
        );
    }

    //User-scope
    @GetMapping("/user")
    public UserProgressResponse getUserResponse(HttpSession session){
        User user = requireUser(session);
        UserProgress progress = progressService.getProgressWithDecayCheckForUser(user);

        return new UserProgressResponse(
                progress.getTotalXP(),
                progress.getDailyXP(),
                progress.getCurrentRank(),
                progress.getLastActivityDate()
        );
    }


    @PostMapping("/xp")
    public ResponseEntity<UserProgress> addXP(@RequestParam int difficulty) {
        progressService.addXP(difficulty);
        UserProgress updated = progressService.getProgressWithDecayCheck();
        return ResponseEntity.ok(updated);  // ✅ return updated progress as JSON
    }

    //USER-SCOPE
    @PostMapping("/user/xp")
    public ResponseEntity<UserProgress> addUserXP(@RequestParam int difficulty, HttpSession session) {

        User user = requireUser(session);
        progressService.addXPForUser(difficulty,user);
        UserProgress updated = progressService.getProgressWithDecayCheckForUser(user);
        return ResponseEntity.ok(updated);  // ✅ return updated progress as JSON
    }

    @PostMapping("/xp/remove")
    public ResponseEntity<UserProgress> removeXP(@RequestParam int difficulty) {
        progressService.removeXP(difficulty);
        UserProgress updated = progressService.getProgressWithDecayCheck();
        return ResponseEntity.ok(updated);  // ✅ return updated progress as JSON
    }

    //User-scope
    @PostMapping("/user/xp/remove")
    public ResponseEntity<UserProgress> removeUserXP(@RequestParam int difficulty, HttpSession session) {
        User user = requireUser(session);
        progressService.removeXPForUser(difficulty,user);
        UserProgress updated = progressService.getProgressWithDecayCheckForUser(user);
        return ResponseEntity.ok(updated);  // ✅ return updated progress as JSON
    }

}
