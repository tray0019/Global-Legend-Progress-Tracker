package com.GLPT.Backend.Service;

import com.GLPT.Backend.Entity.User;
import com.GLPT.Backend.Repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class FollowService {

    private final UserRepository userRepository;

    public FollowService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public void toggleFollow(Long currentUserId, Long targetUserId) {
        User me = userRepository.findById(currentUserId).orElseThrow();
        User target = userRepository.findById(targetUserId).orElseThrow();

        if (me.getFollowing().contains(target)) {
            me.getFollowing().remove(target);
        } else {
            me.getFollowing().add(target);
        }
        userRepository.save(me);
    }

    @Transactional
    public void followUser(User currentUser, Long targetUserId) {
        User targetUser = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (currentUser.getId().equals(targetUserId)) {
            throw new RuntimeException("You cannot follow yourself!");
        }

        currentUser.getFollowing().add(targetUser);
        userRepository.save(currentUser);
    }

    @Transactional
    public void unfollowUser(User currentUser, Long targetUserId) {
        User targetUser = userRepository.findById(targetUserId).orElseThrow();
        currentUser.getFollowing().remove(targetUser);
        userRepository.save(currentUser);
    }

    @Transactional(readOnly = true)
    public Map<String, Integer> getFollowStats(User user) {
        // Re-fetch the user within a transaction to ensure collections are accessible
        User managedUser = userRepository.findById(user.getId()).orElseThrow();
        return Map.of(
                "followersCount", managedUser.getFollowers().size(),
                "followingCount", managedUser.getFollowing().size()
        );
    }
}
