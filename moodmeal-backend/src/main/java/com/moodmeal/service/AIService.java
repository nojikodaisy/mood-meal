package com.moodmeal.service;

import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class AIService {

    @Value("${groq.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateSuggestion(String mood, String cycle, String preference) {
        try {
            String prompt = String.format(
                "Generate a drink or snack suggestion in French but with ENGLISH JSON keys.\n" +
                "Mood: %s, Cycle: %s, Preference: %s\n" +
                "IMPORTANT: Use ONLY English keys: name, benefits, ingredients (with name/quantity), preparation, prepTime, difficulty\n" +
                "Format: {\"name\":\"...\",\"benefits\":\"...\",\"ingredients\":[...],\"preparation\":\"...\",\"prepTime\":\"5 min\",\"difficulty\":\"Facile\"}",
                mood, cycle, preference
            );

            String url = "https://api.groq.com/openai/v1/chat/completions";
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + apiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = Map.of(
                "model", "llama-3.1-8b-instant",
                "messages", List.of(
                    Map.of("role", "system", "content", "You always respond with valid JSON only, in French."),
                    Map.of("role", "user", "content", prompt)
                ),
                "temperature", 0.9,
                "max_tokens", 300,
                "response_format", Map.of("type", "json_object")  // Force JSON valide
            );

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            
            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            String content = jsonNode.get("choices").get(0).get("message").get("content").asText();
            
            // Valider
            objectMapper.readTree(content);
            return content;
            
        } catch (Exception e) {
            log.error("Erreur IA: {}", e.getMessage());
            throw new RuntimeException("Erreur génération IA: " + e.getMessage());
        }
    }
}