package com.adhikaarai.backend.service;

import com.adhikaarai.backend.entity.ApplicationJourney;
import com.adhikaarai.backend.entity.ApplicationStatusHistory;
import com.adhikaarai.backend.entity.Scheme;
import com.adhikaarai.backend.entity.User;
import com.adhikaarai.backend.repository.ApplicationJourneyRepository;
import com.adhikaarai.backend.repository.SchemeRepository;
import com.adhikaarai.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class ApplicationJourneyService {

    private final ApplicationJourneyRepository journeyRepository;
    private final UserRepository userRepository;
    private final SchemeRepository schemeRepository;

    public ApplicationJourneyService(
        ApplicationJourneyRepository journeyRepository,
        UserRepository userRepository,
        SchemeRepository schemeRepository
    ) {
        this.journeyRepository = journeyRepository;
        this.userRepository = userRepository;
        this.schemeRepository = schemeRepository;
    }

    public List<ApplicationJourney> getUserJourneys(Long userId) {
        return journeyRepository.findByUserId(userId);
    }

    @Transactional
    public ApplicationJourney createJourney(Long userId, String schemeId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Scheme scheme = schemeRepository.findById(schemeId)
            .orElseThrow(() -> new IllegalArgumentException("Scheme not found"));

        ApplicationJourney journey = new ApplicationJourney();
        journey.setUser(user);
        journey.setScheme(scheme);
        journey.setCurrentStatus("NOT_STARTED");
        journey.setNextRecommendedAction("Initiate Preflight document readiness audit");
        journey.setCreatedAt(Instant.now());
        journey.setUpdatedAt(Instant.now());

        ApplicationStatusHistory initialHistory = new ApplicationStatusHistory();
        initialHistory.setJourney(journey);
        initialHistory.setStatus("NOT_STARTED");
        initialHistory.setLabel("Scheme Discovered");
        initialHistory.setNotes("Application journey started by citizen");
        initialHistory.setRecordedAt(Instant.now());

        journey.getStatusHistory().add(initialHistory);

        return journeyRepository.save(journey);
    }
}

