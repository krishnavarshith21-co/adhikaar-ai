package com.adhikaarai.backend.controller;

import com.adhikaarai.backend.entity.Scheme;
import com.adhikaarai.backend.service.SchemeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/schemes")
public class SchemeController {

    private final SchemeService schemeService;

    public SchemeController(SchemeService schemeService) {
        this.schemeService = schemeService;
    }

    @GetMapping
    public ResponseEntity<List<Scheme>> listSchemes(
        @RequestParam(required = false) String query,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String providerType
    ) {
        if (query != null || category != null || providerType != null) {
            return ResponseEntity.ok(schemeService.searchSchemes(query, category, providerType));
        }
        return ResponseEntity.ok(schemeService.getAllSchemes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Scheme> getScheme(@PathVariable String id) {
        return schemeService.getSchemeById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
}

