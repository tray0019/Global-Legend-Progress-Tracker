package com.GLPT.Backend.Repository;

import com.GLPT.Backend.Entity.Goal;
import com.GLPT.Backend.Entity.ProgressEntry;
import com.GLPT.Backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressEntryRepository extends JpaRepository<ProgressEntry, Long> {

    Optional<ProgressEntry> findByIdAndGoal_User(Long entryId, User user);
    List<ProgressEntry> findByGoalAndGoal_User(Goal goal, User user);

}
