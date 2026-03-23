package com.jobportal.backend.controller;

import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<User> getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<User> updateProfile(
            @RequestParam(required = false) String bio,
            @RequestParam(required = false) String certificates,
            @RequestParam(required = false) MultipartFile resume) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));
        
        if (bio != null) user.setBio(bio);
        if (certificates != null) user.setCertificates(certificates);

        if (resume != null && !resume.isEmpty()) {
            try {
                user.setResumeData(resume.getBytes());
                user.setResumeFileName(resume.getOriginalFilename());
                user.setResumeContentType(resume.getContentType());
            } catch (Exception e) {
                return ResponseEntity.badRequest().build();
            }
        }
        
        userRepository.save(user);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/resume")
    @PreAuthorize("hasRole('JOB_SEEKER') or hasRole('EMPLOYER')")
    public ResponseEntity<byte[]> getMyResume() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Error: User is not found."));
        
        if (user.getResumeData() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + user.getResumeFileName() + "\"")
                .contentType(MediaType.parseMediaType(user.getResumeContentType()))
                .body(user.getResumeData());
    }
}
