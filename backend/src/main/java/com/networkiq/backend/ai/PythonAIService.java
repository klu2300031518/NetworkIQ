package com.networkiq.backend.ai;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PythonAIService {

    @Autowired
    private RestTemplate restTemplate;

    private final String AI_URL = "http://localhost:5000/recommend";

    public Map<String, Object> getRecommendation(Map<String, Object> request) {

        ResponseEntity<Map> response =
                restTemplate.postForEntity(AI_URL, request, Map.class);

        return response.getBody();

    }

}