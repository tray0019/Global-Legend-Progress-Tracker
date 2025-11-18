package com.GLPT.Backend.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity(name = "ProgressEntry")
@Data
public class ProgressEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String description;

    @ManyToOne
    @JoinColumn(name = "goal_id") //link to ProgressEntry.goal field
    private Goal goal;
}
