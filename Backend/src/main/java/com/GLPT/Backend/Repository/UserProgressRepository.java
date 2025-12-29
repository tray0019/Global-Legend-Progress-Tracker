package com.GLPT.Backend.Repository;

import com.GLPT.Backend.Entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    UserProgress findTopByOrderIdAsc();
}
