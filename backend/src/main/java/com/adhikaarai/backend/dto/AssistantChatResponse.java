package com.adhikaarai.backend.dto;

import java.util.List;

public class AssistantChatResponse {
    private String responseEn;
    private String responseTe;
    private List<String> sources;
    private String sessionId;

    public AssistantChatResponse(String responseEn, String responseTe, List<String> sources, String sessionId) {
        this.responseEn = responseEn;
        this.responseTe = responseTe;
        this.sources = sources;
        this.sessionId = sessionId;
    }

    public String getResponseEn() { return responseEn; }
    public String getResponseTe() { return responseTe; }
    public List<String> getSources() { return sources; }
    public String getSessionId() { return sessionId; }
}

