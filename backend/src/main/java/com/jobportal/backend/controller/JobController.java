package com.jobportal.backend.controller;

import com.jobportal.backend.model.Job;
import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.JobRepository;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    JobRepository jobRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return jobRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('ADMIN')")
    public ResponseEntity<?> createJob(@RequestBody Job job) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User employer = userRepository.findById(userDetails.getId()).orElse(null);
        
        job.setEmployer(employer);
        Job savedJob = jobRepository.save(job);
        
        return ResponseEntity.ok(savedJob);
    }
    
    @GetMapping("/employer")
    @PreAuthorize("hasRole('EMPLOYER')")
    public List<Job> getJobsByEmployer() {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User employer = userRepository.findById(userDetails.getId()).orElse(null);
        return jobRepository.findByEmployer(employer);
    }

    @GetMapping("/all-jobs")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Job> getAdminAllJobs() {
        return jobRepository.findAll();
    }
}
