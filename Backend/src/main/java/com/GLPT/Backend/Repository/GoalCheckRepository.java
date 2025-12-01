package com.GLPT.Backend.Repository;

import com.GLPT.Backend.Entity.GoalCheck;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GoalCheckRepository extends JpaRepository<GoalCheck, Long> {
}
