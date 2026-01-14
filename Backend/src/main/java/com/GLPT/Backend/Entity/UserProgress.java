package com.GLPT.Backend.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name="user_progress")
@Data
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int totalXP = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rank currentRank = Rank.BRONZE;

    @Column(nullable = false)
    private LocalDate lastActivityDate;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updateAt;

    @Column(nullable = false)
    private int dailyXP;

    @PrePersist
    protected void onCreate(){
        this.createdAt = LocalDateTime.now();
        this.updateAt =  LocalDateTime.now();
        this.lastActivityDate = LocalDate.now();
    }

    @PreUpdate
    protected void onUpdate(){
        this.updateAt = LocalDateTime.now();
    }

    @OneToOne
    User user;
}
