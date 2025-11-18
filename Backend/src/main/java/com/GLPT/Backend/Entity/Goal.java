package com.GLPT.Backend.Entity;


import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity(name="Goal")
@Data
public class Goal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String goalTitle;

    @OneToMany(mappedBy = "goal")
    private List<ProgressEntry> entries;

}
