package com.networkiq.backend.controller;

import com.networkiq.backend.entity.RecommendationHistory;
import com.networkiq.backend.repository.RecommendationHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:3000")
public class RecommendationHistoryController {

    @Autowired
    private RecommendationHistoryRepository repository;

    // Save recommendation decision
    @PostMapping("/history")
    public RecommendationHistory saveHistory(
            @RequestBody RecommendationHistory history) {

        history.setCreatedAt(LocalDateTime.now());

        return repository.save(history);
    }

    // Get all recommendation history
    @GetMapping("/history")
    public List<RecommendationHistory> getHistory() {

        return repository.findAll();
    }
}