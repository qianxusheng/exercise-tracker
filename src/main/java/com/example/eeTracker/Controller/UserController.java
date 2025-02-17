package com.example.eeTracker.Controller;

import com.example.eeTracker.model.User;
import com.example.eeTracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.Optional;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@CrossOrigin(origins = "http://localhost:8100")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public User loginUser(@RequestParam String username, @RequestParam String deviceUuid) {
        return userService.getOrCreateUser(username, deviceUuid);
    }

    @PostMapping("/register")
    public User registerUser(@RequestParam String username, @RequestParam String deviceUuid) {
        return userService.getOrCreateUser(username, deviceUuid);
    }

    @GetMapping("/info/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        Optional<User> user = userService.getUserByUsername(username);

        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                .body("User not found with username: " + username);
        }
    }

}
