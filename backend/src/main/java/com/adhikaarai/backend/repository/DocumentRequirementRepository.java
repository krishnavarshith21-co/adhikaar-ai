package com.adhikaarai.backend.repository;

import com.adhikaarai.backend.entity.DocumentRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRequirementRepository extends JpaRepository<DocumentRequirement, String> {
    List<DocumentRequirement> findBySchemeId(String schemeId);
}

