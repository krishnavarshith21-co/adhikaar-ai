package com.adhikaarai.backend.repository;

import com.adhikaarai.backend.entity.UserDocumentReadiness;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDocumentReadinessRepository extends JpaRepository<UserDocumentReadiness, Long> {
    List<UserDocumentReadiness> findByUserId(Long userId);
    Optional<UserDocumentReadiness> findByUserIdAndDocumentRequirementId(Long userId, String documentRequirementId);
}

