package com.adhikaarai.backend.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class AssistantChatRequest {

    @NotBlank(message = "Query text is required")
    private String message;

    private String language = "en"; // "en" or "te"
    private String sessionId;

    public AssistantChatRequest() {}

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }
}

