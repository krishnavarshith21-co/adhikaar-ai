package com.adhikaarai.backend.controller;

import com.adhikaarai.backend.assistant.AssistantService;
import com.adhikaarai.backend.dto.AssistantChatRequest;
import com.adhikaarai.backend.dto.AssistantChatResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/assistant")
public class AssistantController {

    private final AssistantService assistantService;

    public AssistantController(AssistantService assistantService) {
        this.assistantService = assistantService;
    }

    @PostMapping("/chat")
    public ResponseEntity<AssistantChatResponse> chat(@Valid @RequestBody AssistantChatRequest request) {
        return ResponseEntity.ok(assistantService.answer(request));
    }
}

