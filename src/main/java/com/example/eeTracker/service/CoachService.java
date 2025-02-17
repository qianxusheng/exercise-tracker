package com.example.eeTracker.service;

import com.example.eeTracker.model.Coach;
import com.example.eeTracker.model.CoachRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CoachService {

    @Autowired
    private CoachRepository coachRepository;

    public Coach saveCoach(Coach coach) {
        return coachRepository.save(coach);
    }

    public Optional<Coach> getCoachById(Long id) {
        return coachRepository.findById(id);
    }

    public Coach getCoachByUsername(String username) {
        return coachRepository.findByUsername(username);
    }
}

