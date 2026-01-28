package com.GLPT.Backend.Controller;

import com.GLPT.Backend.Entity.User;
import com.GLPT.Backend.Repository.UserRepository;
import com.GLPT.Backend.Service.FollowService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/social")
public class FollowController {

    private final FollowService followService;
    private final UserRepository userRepository;

    public FollowController(FollowService followService, UserRepository userRepository) {
        this.followService = followService;
        this.userRepository = userRepository;
    }

    // ... your requireUser method ...


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


    @PostMapping("/follow/{targetId}")
    public void follow(@PathVariable Long targetId, HttpSession session) {
        User currentUser = requireUser(session);
        followService.followUser(currentUser, targetId);
    }

    @DeleteMapping("/unfollow/{targetId}")
    public void unfollow(@PathVariable Long targetId, HttpSession session) {
        User currentUser = requireUser(session);
        followService.unfollowUser(currentUser, targetId);
    }

    @GetMapping("/stats")
    public Map<String, Integer> getProfileStats(HttpSession session) {
        User user = requireUser(session);
        // We use the service to get counts to avoid Lazy loading issues
        return followService.getFollowStats(user);
    }
}
