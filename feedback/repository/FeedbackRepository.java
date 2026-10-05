package com.adflow.feedback.repository;

import com.adflow.feedback.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    List<Feedback> findByCampaign_CampaignId(Integer campaignId);
    List<Feedback> findByClient_UserId(Integer clientId);
}
