package com.moodmeal.service;

import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class HuggingFaceService {

    @Value("${hf.api.key}")
    private String apiKey;

    @Value("${hf.model.id:mistralai/Mistral-7B-Instruct-v0.2}")
    private String modelId;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateSuggestion(String mood, String cycle, String preference) {
        try {
            String prompt = buildPrompt(mood, cycle, preference);
            String response = callHuggingFaceAPI(prompt);
            
            // Extraire le JSON de la réponse
            String cleanJson = extractAndCleanJson(response);
            
            // Valider que c'est du JSON valide
            objectMapper.readTree(cleanJson);
            
            return cleanJson;
            
        } catch (Exception e) {
            log.error("Erreur API, utilisation du fallback: {}", e.getMessage());
            return buildFallbackResponse(mood, cycle, preference);
        }
    }

    private String buildPrompt(String mood, String cycle, String preference) {
        // Prompt ultra-clair pour forcer la génération de JSON
        return String.format(
            "<s>[INST] Tu es un nutritionniste. Réponds UNIQUEMENT avec un JSON valide, sans texte avant ou après.\n\n" +
            "Utilisateur:\n" +
            "- Humeur: %s\n" +
            "- Phase cycle menstruel: %s\n" +
            "- Préférence: %s\n\n" +
            "Génère un JSON avec cette structure EXACTE:\n" +
            "{\n" +
            "  \"name\": \"nom de la boisson ou snack\",\n" +
            "  \"benefits\": \"bénéfices pour cette situation\",\n" +
            "  \"ingredients\": [\"ingredient1\", \"ingredient2\", \"ingredient3\"],\n" +
            "  \"preparation\": \"étapes de préparation simples\"\n" +
            "}\n\n" +
            "Réponds UNIQUEMENT avec le JSON, rien d'autre. [/INST]\n",
            mood, cycle, preference
        );
    }

    private String callHuggingFaceAPI(String prompt) {
        String url = "https://api-inference.huggingface.co/models/" + modelId;
        
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
            "inputs", prompt,
            "parameters", Map.of(
                "max_new_tokens", 200,
                "temperature", 0.7,
                "top_p", 0.95,
                "return_full_text", false,
                "do_sample", true
            )
        );

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        
        log.info("Appel API Hugging Face avec modèle: {}", modelId);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        
        return response.getBody();
    }

    private String extractAndCleanJson(String rawResponse) throws Exception {
        JsonNode jsonNode = objectMapper.readTree(rawResponse);
        
        String generatedText;
        if (jsonNode.isArray() && jsonNode.size() > 0) {
            generatedText = jsonNode.get(0).get("generated_text").asText();
        } else if (jsonNode.has("generated_text")) {
            generatedText = jsonNode.get("generated_text").asText();
        } else {
            generatedText = rawResponse;
        }

        // Nettoyer le texte pour extraire le JSON
        generatedText = generatedText.trim();
        
        // Trouver le premier { et le dernier }
        int start = generatedText.indexOf("{");
        int end = generatedText.lastIndexOf("}");
        
        if (start >= 0 && end > start) {
            return generatedText.substring(start, end + 1);
        }
        
        throw new Exception("Pas de JSON valide trouvé dans la réponse");
    }

    private String buildFallbackResponse(String mood, String cycle, String preference) {
        // Suggestions personnalisées par humeur
        Map<String, Map<String, String>> suggestions = Map.of(
            "stressed", Map.of(
                "name", "Infusion Camomille-Lavande",
                "benefits", "Réduit le stress et l'anxiété, favorise la relaxation",
                "ingredients", "[\"camomille\", \"lavande\", \"miel\", \"eau chaude\"]",
                "preparation", "Infuser 1 cuillère de camomille et lavande dans 250ml d'eau chaude pendant 5-7 minutes. Ajouter du miel selon le goût."
            ),
            "tired", Map.of(
                "name", "Smoothie Énergétique Banane-Avoine",
                "benefits", "Boost d'énergie naturel, riche en vitamines B et magnésium",
                "ingredients", "[\"banane\", \"flocons d'avoine\", \"lait d'amande\", \"miel\", \"cannelle\"]",
                "preparation", "Mixer 1 banane, 30g de flocons d'avoine, 200ml de lait d'amande, 1 c. à soupe de miel et une pincée de cannelle."
            ),
            "happy", Map.of(
                "name", "Thé Vert au Citron et Gingembre",
                "benefits", "Maintient la bonne humeur, antioxydants puissants",
                "ingredients", "[\"thé vert\", \"citron\", \"gingembre frais\", \"miel\"]",
                "preparation", "Infuser du thé vert 3 minutes, ajouter du jus de citron frais et du gingembre râpé. Sucrer avec du miel."
            ),
            "sad", Map.of(
                "name", "Chocolat Chaud au Lait d'Amande",
                "benefits", "Stimule la sérotonine, réconfortant et chaleureux",
                "ingredients", "[\"cacao pur\", \"lait d'amande\", \"sirop d'érable\", \"vanille\"]",
                "preparation", "Chauffer 250ml de lait d'amande, ajouter 2 c. à soupe de cacao, 1 c. à soupe de sirop d'érable et de la vanille."
            )
        );

        // Sélectionner la suggestion appropriée
        Map<String, String> selected = suggestions.getOrDefault(
            mood.toLowerCase(), 
            suggestions.get("happy")
        );

        // Adapter selon la phase du cycle
        String cycleNote = "";
        if (cycle.equalsIgnoreCase("menstrual")) {
            cycleNote = " Riche en fer pour cette phase.";
        } else if (cycle.equalsIgnoreCase("luteal")) {
            cycleNote = " Aide à réguler l'humeur pendant cette phase.";
        }

        return String.format(
            "{\"name\":\"%s\",\"benefits\":\"%s%s\",\"ingredients\":%s,\"preparation\":\"%s\"}",
            selected.get("name"),
            selected.get("benefits"),
            cycleNote,
            selected.get("ingredients"),
            selected.get("preparation")
        );
    }
}