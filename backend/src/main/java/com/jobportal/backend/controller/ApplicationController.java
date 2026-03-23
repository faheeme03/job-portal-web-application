package com.jobportal.backend.controller;

import com.jobportal.backend.model.Application;
import com.jobportal.backend.model.Job;
import com.jobportal.backend.model.User;
import com.jobportal.backend.payload.response.MessageResponse;
import com.jobportal.backend.repository.ApplicationRepository;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    ApplicationRepository applicationRepository;

    @Autowired
    JobRepository jobRepository;

    @Autowired
    UserRepository userRepository;

    @PostMapping("/apply")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<?> applyForJob(@RequestParam("jobId") Long jobId,
                                         @RequestParam("resume") MultipartFile file) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User user = userRepository.findById(userDetails.getId()).orElse(null);
            Job job = jobRepository.findById(jobId).orElse(null);

            if (job == null) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Job not found!"));
            }

            if (applicationRepository.existsByJobAndUser(job, user)) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: You have already applied for this job!"));
            }

            Application app = new Application();
            app.setJob(job);
            app.setUser(user);
            app.setFileName(file.getOriginalFilename());
            app.setFileType(file.getContentType());
            app.setResumeData(file.getBytes());

            applicationRepository.save(app);

            return ResponseEntity.ok(new MessageResponse("Applied successfully!"));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(new MessageResponse("Error uploading resume."));
        }
    }

    @GetMapping("/user")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public List<Application> getUserApplications() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElse(null);
        return applicationRepository.findByUser(user);
    }

    @GetMapping("/employer")
    @PreAuthorize("hasRole('EMPLOYER')")
    public List<Application> getEmployerApplications() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User employer = userRepository.findById(userDetails.getId()).orElse(null);
        return applicationRepository.findByJob_Employer(employer);
    }

    @GetMapping("/{id}/resume")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('JOB_SEEKER')")
    public ResponseEntity<byte[]> getApplicationResume(@PathVariable Long id) {
        Application app = applicationRepository.findById(id).orElseThrow(() -> new RuntimeException("Application not found"));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + app.getFileName() + "\"")
                .contentType(MediaType.parseMediaType(app.getFileType()))
                .body(app.getResumeData());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        Application app = applicationRepository.findById(id).orElseThrow(() -> new RuntimeException("Application not found"));
        app.setStatus(status);
        applicationRepository.save(app);
        return ResponseEntity.ok(new MessageResponse("Status updated successfully!"));
    }
}
