package com.GLPT.Backend.Repository;

import com.GLPT.Backend.Entity.Goal;
import com.GLPT.Backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query("""
    SELECT DISTINCT g
    FROM Goal g
    LEFT JOIN FETCH g.entries
    WHERE g.user.id = :userId
""")
    List<Goal> findGoalsWithEntriesByUserId(Long userId);



}
