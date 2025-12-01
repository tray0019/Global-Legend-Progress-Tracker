package com.GLPT.Backend.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity()
@Table(
        name="goal_check",
        uniqueConstraints = @UniqueConstraint(columnNames = {"goal_id", "check_date"}))
@Data
public class GoalCheck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "goal_id")
    private Goal goal;

    @Column(name="check_date")
    private LocalDate checkDate;

}
