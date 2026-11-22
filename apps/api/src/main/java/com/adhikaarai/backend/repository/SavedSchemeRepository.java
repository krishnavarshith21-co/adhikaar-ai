package com.adhikaarai.backend.repository;

import com.adhikaarai.backend.entity.SavedScheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedSchemeRepository extends JpaRepository<SavedScheme, Long> {
    List<SavedScheme> findByUserId(Long userId);
    Optional<SavedScheme> findByUserIdAndSchemeId(Long userId, String schemeId);
    void deleteByUserIdAndSchemeId(Long userId, String schemeId);
}

