package com.jobportal.backend.controller;

import com.jobportal.backend.model.Application;
import com.jobportal.backend.model.Message;
import com.jobportal.backend.model.User;
import com.jobportal.backend.repository.ApplicationRepository;
import com.jobportal.backend.repository.MessageRepository;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
public class ChatController {

    @Autowired
    MessageRepository messageRepository;

    @Autowired
    ApplicationRepository applicationRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    SimpMessagingTemplate messagingTemplate;

    @GetMapping("/{applicationId}")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('JOB_SEEKER')")
    public ResponseEntity<List<Message>> getChatHistory(@PathVariable Long applicationId) {
        List<Message> messages = messageRepository.findByApplicationIdOrderByTimestampAsc(applicationId);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/{applicationId}")
    @PreAuthorize("hasRole('EMPLOYER') or hasRole('JOB_SEEKER')")
    public ResponseEntity<?> sendMessage(@PathVariable Long applicationId, @RequestBody Map<String, String> payload) {
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User sender = userRepository.findById(userDetails.getId()).orElse(null);
        Application currApp = applicationRepository.findById(applicationId).orElseThrow(() -> new RuntimeException("App not found"));

        if (!"ACCEPTED".equals(currApp.getStatus()) && !"INTERVIEWING".equals(currApp.getStatus())) {
            return ResponseEntity.badRequest().body("You can only chat if the application is ACCEPTED.");
        }

        User receiver = sender.getId().equals(currApp.getUser().getId()) ? currApp.getJob().getEmployer() : currApp.getUser();

        Message msg = new Message();
        msg.setApplication(currApp);
        msg.setSender(sender);
        msg.setReceiver(receiver);
        msg.setContent(payload.get("content"));
        
        Message saved = messageRepository.save(msg);

        // Broadcast to WebSocket subscribers
        messagingTemplate.convertAndSend("/topic/chat/" + applicationId, saved);

        return ResponseEntity.ok(saved);
    }
}
