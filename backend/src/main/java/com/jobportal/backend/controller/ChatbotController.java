package com.jobportal.backend.controller;

import com.jobportal.backend.model.Job;
import com.jobportal.backend.payload.request.ChatQueryRequest;
import com.jobportal.backend.payload.response.ChatQueryResponse;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    @Autowired
    private AiService aiService;

    @Autowired
    private JobRepository jobRepository;

    @PostMapping("/query")
    @PreAuthorize("hasRole('JOB_SEEKER') or hasRole('EMPLOYER')")
    public ResponseEntity<ChatQueryResponse> queryChatbot(@RequestBody ChatQueryRequest request) {
        
        List<Job> availableJobs = request.getJobs();
        if (availableJobs == null || availableJobs.isEmpty()) {
            // If the frontend didn't pass specific jobs, fetch all jobs
            availableJobs = jobRepository.findAll();
        }

        ChatQueryResponse response = aiService.processChatQuery(request.getMessage(), availableJobs);
        return ResponseEntity.ok(response);
    }
}
