package com.networkiq.backend.repository;

import com.networkiq.backend.entity.RecommendationHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RecommendationHistoryRepository
        extends JpaRepository<RecommendationHistory, Long> {
}