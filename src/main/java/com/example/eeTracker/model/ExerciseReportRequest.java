package com.example.eeTracker.model;
import lombok.*;
import java.time.ZonedDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
// Data Transfer Object
public class ExerciseReportRequest {
    private String username;
    private String exerciseType;
    private int duration;
    private String location;
    private ZonedDateTime reportTime;
    private String deviceUuid;
}
