package com.example.eeTracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class EeTrackerApplication {

	public static void main(String[] args) {
		SpringApplication.run(EeTrackerApplication.class, args);
	}

}

// INSERT INTO users (username, device_uuid, created_at, updated_at) VALUES 
// ('Alice', 'uuid-1234', '2024-01-01 10:00:00', '2024-01-01 10:00:00'),
// ('Bob', 'uuid-5678', '2024-01-02 11:30:00', '2024-01-02 11:30:00'),
// ('Charlie', 'uuid-999', '2024-01-10 15:00:00', '2024-01-10 15:00:00');


// INSERT INTO exercise_reports (user_id, exercise_type, duration, location, report_time) VALUES 
// (1, 'Running', 30, 'outside', '2024-01-01 12:00:00'),
// (1, 'Cycling', 45, 'outside', '2025-02-04 08:15:00'),
// (2, 'Swimming', 60, 'inside', '2024-01-02 10:00:00'),
// (2, 'Yoga', 50, 'inside', '2024-01-03 09:30:00'),
// (3, 'Walking', 40, 'outside', '2024-01-03 07:45:00'),
// (3, 'Running', 25, 'outside', '2024-01-04 16:00:00'),
// (1, 'Weightlifting', 35, 'inside', '2024-01-04 18:30:00'),
// (2, 'Jogging', 30, 'outside', '2024-01-05 11:00:00'),
// (3, 'Swimming', 50, 'inside', '2024-01-05 14:15:00'),
// (1, 'Crossfit', 40, 'inside', '2025-02-11 13:00:00'),
// (1, 'Cycling', 45, 'outside', '2025-02-12 08:15:00');
