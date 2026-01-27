package com.GLPT.Backend.Repository;

import com.GLPT.Backend.DTO.LeaderboardUserDTO;
import com.GLPT.Backend.Entity.User;
import com.GLPT.Backend.Entity.UserProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress, Long> {
    UserProgress findTopByOrderByIdAsc();
    Optional<UserProgress> findByUser(User user);
    public Optional<UserProgress> findByUserId(Long userId);

    @Query("SELECT new com.GLPT.Backend.DTO.LeaderboardUserDTO(p.user.firstName, p.user.lastName, p.totalXP, p.currentRank) " +
            "FROM UserProgress p " +
            "ORDER BY p.totalXP DESC")
    List<LeaderboardUserDTO> getGlobalLeaderboard();
}
