package com.adhikaarai.backend.repository;

import com.adhikaarai.backend.entity.Scheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchemeRepository extends JpaRepository<Scheme, String> {

    @Query("SELECT s FROM Scheme s WHERE " +
           "(:query IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:categoryCode IS NULL OR s.category.code = :categoryCode) AND " +
           "(:providerType IS NULL OR s.provider.providerType = :providerType)")
    List<Scheme> searchSchemes(
        @Param("query") String query,
        @Param("categoryCode") String categoryCode,
        @Param("providerType") String providerType
    );
}

