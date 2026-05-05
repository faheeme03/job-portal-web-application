package com.jobportal.backend.payload.request;

import com.jobportal.backend.model.Job;
import java.util.List;

public class ChatQueryRequest {
    private String message;
    private List<Job> jobs;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<Job> getJobs() {
        return jobs;
    }

    public void setJobs(List<Job> jobs) {
        this.jobs = jobs;
    }
}
