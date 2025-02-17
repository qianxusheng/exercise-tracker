package com.example.eeTracker.model;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CoachRepository extends JpaRepository<Coach, Long> {
    Coach findByUsername(String username);
}

