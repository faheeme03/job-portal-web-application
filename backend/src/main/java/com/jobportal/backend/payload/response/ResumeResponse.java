package com.jobportal.backend.payload.response;

public class ResumeResponse {
    private String htmlContent;

    public ResumeResponse(String htmlContent) {
        this.htmlContent = htmlContent;
    }

    public String getHtmlContent() { return htmlContent; }
    public void setHtmlContent(String htmlContent) { this.htmlContent = htmlContent; }
}
