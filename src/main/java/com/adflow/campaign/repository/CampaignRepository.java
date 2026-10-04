package com.adflow.campaign.repository;

import com.adflow.campaign.entity.Campaign;
import com.adflow.campaign.enums.CampaignStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CampaignRepository extends JpaRepository<Campaign, Integer> {
    List<Campaign> findByStatus(CampaignStatus status);
    List<Campaign> findByClient_UserId(Integer clientId);
    List<Campaign> findByManager_UserId(Integer managerId);
    boolean existsByClient_UserIdAndCampaignNameIgnoreCase(Integer clientId, String campaignName);
    boolean existsByClient_UserIdAndCampaignNameIgnoreCaseAndCampaignIdNot(Integer clientId, String campaignName, Integer campaignId);
}
