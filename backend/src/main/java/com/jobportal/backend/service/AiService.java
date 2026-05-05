package com.jobportal.backend.service;

import com.jobportal.backend.model.Job;
import com.jobportal.backend.payload.response.ChatQueryResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.jobportal.backend.payload.request.ResumeRequest;
import com.jobportal.backend.payload.response.ResumeResponse;

@Service
public class AiService {

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ResumeResponse generateResumeContent(ResumeRequest details) {
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty() || "YOUR_API_KEY".equals(geminiApiKey)) {
            return new ResumeResponse("<p>AI integration is disabled. Please configure your API key.</p>");
        }

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

            String prompt = "You are an expert resume writer. Create a professional, ATS-friendly resume in pure HTML format (without <html>, <head>, or <body> tags, just the inner content). " +
                    "Use semantic tags like <h1>, <h2>, <h3>, <ul>, <li>, <p>, and <strong>. Use inline CSS only for basic structure like margins and text alignment (keep it clean and professional, black text on white background). " +
                    "\nHere are the details provided by the candidate:\n" +
                    "- Name: " + details.getName() + "\n" +
                    "- Email: " + details.getEmail() + "\n" +
                    "- Phone: " + details.getPhone() + "\n" +
                    "- DOB: " + details.getDob() + "\n" +
                    "- Desired Title: " + details.getDesiredJobTitle() + "\n" +
                    "- Summary/Bio: " + details.getSummary() + "\n" +
                    "- Experience: " + details.getExperience() + "\n" +
                    "- Education: " + details.getEducation() + "\n" +
                    "- Skills: " + details.getSkills() + "\n" +
                    "- Projects: " + details.getProjects() + "\n" +
                    "- Hobbies/Interests: " + details.getHobbies() + "\n" +
                    "\nPlease expand on these points professionally, fix any grammar, and organize them into standard resume sections (e.g., Summary, Experience, Education, Projects, Skills). Return ONLY the HTML as a raw string, without markdown ```html code block markers. Do not include any JSON wrapping.";

            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            Map<String, Object> parts = new HashMap<>();
            parts.put("text", prompt);
            content.put("parts", new Object[]{parts});
            requestBody.put("contents", new Object[]{content});

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            String responseContent = restTemplate.postForObject(url, request, String.class);
            JsonNode rootNode = objectMapper.readTree(responseContent);
            JsonNode candidates = rootNode.path("candidates");
            if (candidates.isArray() && candidates.size() > 0) {
                String htmlText = candidates.get(0).path("content").path("parts").get(0).path("text").asText();
                if (htmlText.startsWith("```html")) htmlText = htmlText.substring(7);
                if (htmlText.startsWith("```")) htmlText = htmlText.substring(3);
                if (htmlText.endsWith("```")) htmlText = htmlText.substring(0, htmlText.length() - 3);
                return new ResumeResponse(htmlText.trim());
            }

            return new ResumeResponse("<p>Sorry, AI could not generate the resume at this time.</p>");
        } catch (Exception e) {
            e.printStackTrace();
            return new ResumeResponse("<p>Error generating resume: " + e.getMessage() + "</p>");
        }
    }

    public ChatQueryResponse processChatQuery(String userMessage, List<Job> availableJobs) {
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty() || "YOUR_API_KEY".equals(geminiApiKey)) {
            return new ChatQueryResponse("AI integration is currently disabled because the API key is not configured.", new ArrayList<>());
        }

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + geminiApiKey;

            // Construct jobs context
            StringBuilder jobsContext = new StringBuilder();
            jobsContext.append("Available Jobs:\n");
            for (Job job : availableJobs) {
                jobsContext.append(String.format("- ID: %d, Title: %s, Company: %s, Location: %s, Salary: %.2f\n  Description: %s\n\n",
                        job.getId(), job.getTitle(), job.getCompany(), job.getLocation(), job.getSalary(), job.getDescription()));
            }

            String prompt = "You are a helpful AI assistant for a job portal. " +
                    "A job seeker is asking you a question to help filter or find jobs. " +
                    "Here is the list of available jobs:\n" + jobsContext.toString() +
                    "\nThe job seeker asks: \"" + userMessage + "\"\n\n" +
                    "Respond with a JSON object exactly in this format without markdown formatting (only standard JSON):\n" +
                    "{\n" +
                    "  \"reply\": \"Your conversational reply to the job seeker\",\n" +
                    "  \"matchedJobIds\": [list of integer IDs that match or are relevant, empty array if none]\n" +
                    "}";

            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> content = new HashMap<>();
            Map<String, Object> parts = new HashMap<>();
            parts.put("text", prompt);
            content.put("parts", new Object[]{parts});
            requestBody.put("contents", new Object[]{content});

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            String responseContent = restTemplate.postForObject(url, request, String.class);

            // Parse response
            JsonNode rootNode = objectMapper.readTree(responseContent);
            JsonNode candidates = rootNode.path("candidates");
            if (candidates.isArray() && candidates.size() > 0) {
                String text = candidates.get(0).path("content").path("parts").get(0).path("text").asText();
                
                // Remove markdown formatting if present
                if (text.startsWith("```json")) {
                    text = text.substring(7);
                    if (text.endsWith("```")) {
                        text = text.substring(0, text.length() - 3);
                    }
                } else if (text.startsWith("```")) {
                    text = text.substring(3);
                    if (text.endsWith("```")) {
                        text = text.substring(0, text.length() - 3);
                    }
                }

                JsonNode parsedResult = objectMapper.readTree(text.trim());
                String reply = parsedResult.path("reply").asText("Here are the jobs I found.");
                List<Long> matchedIds = new ArrayList<>();
                if (parsedResult.has("matchedJobIds") && parsedResult.get("matchedJobIds").isArray()) {
                    for (JsonNode idNode : parsedResult.get("matchedJobIds")) {
                        matchedIds.add(idNode.asLong());
                    }
                }
                
                return new ChatQueryResponse(reply, matchedIds);
            }

            return new ChatQueryResponse("Sorry, I could not process your request at this time.", new ArrayList<>());

        } catch (Exception e) {
            e.printStackTrace();
            return new ChatQueryResponse("An error occurred while communicating with the AI: " + e.getMessage(), new ArrayList<>());
        }
    }
}
