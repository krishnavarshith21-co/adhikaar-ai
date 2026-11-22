package com.adhikaarai.backend.service;

import com.adhikaarai.backend.entity.Scheme;
import com.adhikaarai.backend.repository.SchemeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SchemeService {

    private final SchemeRepository schemeRepository;

    public SchemeService(SchemeRepository schemeRepository) {
        this.schemeRepository = schemeRepository;
    }

    public List<Scheme> getAllSchemes() {
        return schemeRepository.findAll();
    }

    public Optional<Scheme> getSchemeById(String id) {
        return schemeRepository.findById(id);
    }

    public List<Scheme> searchSchemes(String query, String categoryCode, String providerType) {
        return schemeRepository.searchSchemes(query, categoryCode, providerType);
    }
}

