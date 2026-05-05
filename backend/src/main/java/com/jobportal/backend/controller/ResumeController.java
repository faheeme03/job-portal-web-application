package com.jobportal.backend.controller;

import com.jobportal.backend.payload.request.ResumeRequest;
import com.jobportal.backend.payload.response.ResumeResponse;
import com.jobportal.backend.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    @Autowired
    private AiService aiService;

    @PostMapping("/generate")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<ResumeResponse> generateResume(@RequestBody ResumeRequest request) {
        ResumeResponse response = aiService.generateResumeContent(request);
        return ResponseEntity.ok(response);
    }
}
