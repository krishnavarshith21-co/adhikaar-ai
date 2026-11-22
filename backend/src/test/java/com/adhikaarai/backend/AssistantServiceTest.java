package com.adhikaarai.backend;
import com.adhikaarai.backend.assistant.AssistantService;
import com.adhikaarai.backend.dto.AssistantChatRequest;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import static org.junit.jupiter.api.Assertions.*;
class AssistantServiceTest {
    @Test void retiredEndpointNeverFabricatesAnswers() {
        assertEquals(410, assertThrows(ResponseStatusException.class, () -> new AssistantService().answer(new AssistantChatRequest())).getStatusCode().value());
    }
}
