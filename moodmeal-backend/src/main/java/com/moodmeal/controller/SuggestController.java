package com.moodmeal.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.moodmeal.service.AIService;
import lombok.extern.slf4j.Slf4j;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class SuggestController {

    private final AIService aiService;
    private final ObjectMapper objectMapper;

    public SuggestController(AIService aiService) {
        this.aiService = aiService;
        this.objectMapper = new ObjectMapper();
    }

    @PostMapping("/suggest")
    public ResponseEntity<Map<String, Object>> suggest(@RequestBody Map<String, String> payload) {
        try {
            String mood = payload.getOrDefault("mood", "neutral");
            String cycle = payload.getOrDefault("cycle", "follicular");
            String preference = payload.getOrDefault("preference", "any");

            log.info("Requête reçue - mood: {}, cycle: {}, preference: {}", mood, cycle, preference);

            String responseJson = aiService.generateSuggestion(mood, cycle, preference);
            Map<String, Object> result = objectMapper.readValue(responseJson, new TypeReference<>() {});
            
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            log.error("Erreur lors de la génération: {}", e.getMessage());
            
            // Retourner une réponse d'erreur propre
            return ResponseEntity.status(500).body(Map.of(
                "error", true,
                "message", "Erreur lors de la génération de la suggestion",
                "details", e.getMessage()
            ));
        }
    }
}