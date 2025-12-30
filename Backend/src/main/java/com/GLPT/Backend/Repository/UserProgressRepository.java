package com.GLPT.Backend.Repository;

import com.GLPT.Backend.Entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    UserProgress findTopByOrderByIdAsc();
}
