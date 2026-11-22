package com.adhikaarai.backend.assistant;
import com.adhikaarai.backend.dto.AssistantChatRequest;
import com.adhikaarai.backend.dto.AssistantChatResponse;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
@Service
public class AssistantService {
    public AssistantChatResponse answer(AssistantChatRequest request) {
        // The authenticated Next.js endpoint owns retrieval and live model calls.
        throw new ResponseStatusException(HttpStatus.GONE, "Use the authenticated /api/assistant/chat endpoint.");
    }
}
