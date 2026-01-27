package com.GLPT.Backend.Service;

import com.GLPT.Backend.Entity.User;
import com.GLPT.Backend.Repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class FollowService {

    private final UserRepository userRepository;

    public FollowService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

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
}
