package com.jobportal.backend.repository;

import com.jobportal.backend.model.Job;
import com.jobportal.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByEmployer(User employer);
    List<Job> findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(String title, String location);
}
