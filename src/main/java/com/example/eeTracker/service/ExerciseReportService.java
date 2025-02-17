package com.example.eeTracker.service;

import com.example.eeTracker.model.ExerciseReport;
import com.example.eeTracker.model.ExerciseReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.List;

@Service
public class ExerciseReportService {

    @Autowired
    private ExerciseReportRepository exerciseReportRepository;

    public ExerciseReport saveExerciseReport(ExerciseReport report) {
        return exerciseReportRepository.save(report);
    }

    public List<ExerciseReport> getReportsByUserId(Long userId) {
        return exerciseReportRepository.findByUserId(userId);
    }
    
    public List<ExerciseReport> getPastSevenDaysReports(Long userId) {
        // Get current date and time
        ZonedDateTime now = ZonedDateTime.now();
        
        // Calculate the date for 7 days ago
        ZonedDateTime sevenDaysAgo = now.minusDays(7);
        
        return exerciseReportRepository.findReportsByUserIdAndReportTimeAfter(userId, sevenDaysAgo);
    }
}
