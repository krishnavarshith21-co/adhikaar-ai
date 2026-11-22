package com.adhikaarai.backend.repository;

import com.adhikaarai.backend.entity.ApplicationJourney;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationJourneyRepository extends JpaRepository<ApplicationJourney, Long> {
    List<ApplicationJourney> findByUserId(Long userId);
}

