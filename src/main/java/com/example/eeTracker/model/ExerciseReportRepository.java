package com.example.eeTracker.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.ZonedDateTime;
import java.util.List;

public interface ExerciseReportRepository extends JpaRepository<ExerciseReport, Long> {
    List<ExerciseReport> findReportsByUserIdAndReportTimeAfter(Long userId, ZonedDateTime dateTime);
    List<ExerciseReport> findByUserId(Long userId);
}
