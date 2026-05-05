package com.jobportal.backend.repository;

import com.jobportal.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByApplicationIdOrderByTimestampAsc(Long applicationId);
}
