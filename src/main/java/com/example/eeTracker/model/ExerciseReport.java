package com.example.eeTracker.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.ZonedDateTime;

@Entity
@Table(name = "exercise_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    private String exerciseType;
    private int duration;  // mintues
    private String location;  // inside 或 outside

    @Column(nullable = false)
    private ZonedDateTime reportTime;
    //private String reportTime;  // report time
}
