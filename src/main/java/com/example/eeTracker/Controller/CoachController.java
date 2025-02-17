package com.example.eeTracker.Controller;

import com.example.eeTracker.model.Coach;
import com.example.eeTracker.model.User;
import com.example.eeTracker.service.CoachService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.eeTracker.service.UserService;
import com.example.eeTracker.model.ExerciseReport;
import com.example.eeTracker.service.ExerciseReportService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/coaches")
public class CoachController {

    @Autowired
    private CoachService coachService;

    @Autowired
    private ExerciseReportService exerciseReportService;

    @Autowired
    private UserService userService;

    // API to create a new coach
    @PostMapping("/register")
    public ResponseEntity<Coach> registerCoach(@RequestBody Coach coach) {
        Coach savedCoach = coachService.saveCoach(coach);
        return ResponseEntity.ok(savedCoach);
    }

    // API to login a coach (simple example, you might want to use JWT for real authentication)
    @PostMapping("/login")
    public ResponseEntity<String> loginCoach(@RequestBody Coach loginRequest) {
        Coach coach = coachService.getCoachByUsername(loginRequest.getUsername());
        if (coach == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Account does not exist");
        }
        if (!coach.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect password");
        }
        return ResponseEntity.ok("Login successful");
    }
    

    // http://localhost:8080/api/coaches/users
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/user/{userId}/reports")
    public ResponseEntity<List<ExerciseReport>> getReportsByUserId(@PathVariable Long userId) {
        try {
            List<ExerciseReport> reports = exerciseReportService.getReportsByUserId(userId);

            if (reports.isEmpty()) {
                return ResponseEntity.ok(List.of()); 
            }

            return ResponseEntity.ok(reports);  
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);  
        }
    }

    // http://localhost:8080/api/coaches/user/1/reports/last7days
    @GetMapping("/user/{userId}/reports/last7days")
    public ResponseEntity<List<ExerciseReport>> getReportsForLast7Days(@PathVariable Long userId) {
        try {
            List<ExerciseReport> reports = exerciseReportService.getPastSevenDaysReports(userId);

            if (reports.isEmpty()) {
                return ResponseEntity.ok(List.of());
            }
            return ResponseEntity.ok(reports);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}
