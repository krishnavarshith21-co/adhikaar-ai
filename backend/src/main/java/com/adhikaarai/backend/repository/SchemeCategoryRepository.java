package com.adhikaarai.backend.repository;

import com.adhikaarai.backend.entity.SchemeCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SchemeCategoryRepository extends JpaRepository<SchemeCategory, Long> {
    Optional<SchemeCategory> findByCode(String code);
}

