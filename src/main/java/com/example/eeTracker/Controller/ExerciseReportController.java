package com.example.eeTracker.Controller;

import com.example.eeTracker.model.ExerciseReport;
import com.example.eeTracker.service.ExerciseReportService;
import com.example.eeTracker.model.User;
import com.example.eeTracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.eeTracker.model.ExerciseReportRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:8100")
@RestController
@RequestMapping("/api/reports")
public class ExerciseReportController {

    @Autowired
    private ExerciseReportService exerciseReportService;

    @Autowired
    private UserService userService;

    @PostMapping("/submitBatch")
    public ResponseEntity<List<ExerciseReport>> submitReports(@RequestBody List<ExerciseReportRequest> reportRequests) {
        try {
            if (reportRequests.isEmpty()) {
                return ResponseEntity.ok(Collections.emptyList());
            }
            
            Optional<ZonedDateTime> latestReportTime = reportRequests.stream()
                .map(ExerciseReportRequest::getReportTime)
                .max(ZonedDateTime::compareTo);
            
            List<ExerciseReport> savedReports = reportRequests.stream().map(request -> {
                User user = userService.getOrCreateUser(request.getUsername(), request.getDeviceUuid());

                ExerciseReport report = new ExerciseReport();
                report.setUser(user);
                report.setExerciseType(request.getExerciseType());
                report.setDuration(request.getDuration());
                report.setLocation(request.getLocation());
                report.setReportTime(request.getReportTime());

                return exerciseReportService.saveExerciseReport(report);
            }).toList();

            if (latestReportTime.isPresent()) {
                User user = savedReports.get(0).getUser(); 
                user.setUpdatedAt(latestReportTime.get());
                userService.saveUser(user); 
            }

            return ResponseEntity.ok(savedReports);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(Collections.singletonList(new ExerciseReport()));
        }
    }

    @GetMapping("/history/{userId}")
    public ResponseEntity<List<ExerciseReport>> getHistory(@PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<ExerciseReport> reports = exerciseReportService.getPastSevenDaysReports(user.getId());
            
            if (reports.isEmpty()) {
                return ResponseEntity.noContent().build();  // If no reports are found
            }
            return ResponseEntity.ok(reports);  // Return found reports
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);  // Internal error handling
        }
    }

}
