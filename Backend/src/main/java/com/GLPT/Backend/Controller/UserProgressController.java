package com.GLPT.Backend.Controller;

import com.GLPT.Backend.DTO.UserProgressResponse;
import com.GLPT.Backend.Entity.UserProgress;
import com.GLPT.Backend.Service.UserProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/progress")
@CrossOrigin(origins = "http://localhost:3000/")
public class UserProgressController {

    private final UserProgressService progressService;

    UserProgressController(UserProgressService progressService){
        this.progressService = progressService;
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

    @PostMapping("/xp")
    public ResponseEntity<UserProgress> addXP(@RequestParam int difficulty) {
        progressService.addXP(difficulty);
        UserProgress updated = progressService.getProgressWithDecayCheck();
        return ResponseEntity.ok(updated);  // ✅ return updated progress as JSON
    }

    @PostMapping("/xp/remove")
    public ResponseEntity<UserProgress> removeXP(@RequestParam int difficulty) {
        progressService.removeXP(difficulty);
        UserProgress updated = progressService.getProgressWithDecayCheck();
        return ResponseEntity.ok(updated);  // ✅ return updated progress as JSON
    }

}
