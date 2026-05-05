package com.jobportal.backend.payload.response;

import java.util.List;

public class ChatQueryResponse {
    private String reply;
    private List<Long> matchedJobIds;

    public ChatQueryResponse(String reply, List<Long> matchedJobIds) {
        this.reply = reply;
        this.matchedJobIds = matchedJobIds;
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public List<Long> getMatchedJobIds() {
        return matchedJobIds;
    }

    public void setMatchedJobIds(List<Long> matchedJobIds) {
        this.matchedJobIds = matchedJobIds;
    }
}
