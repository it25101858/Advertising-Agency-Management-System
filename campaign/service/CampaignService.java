package com.adflow.campaign.service;

import com.adflow.campaign.dto.CampaignRequest;
import com.adflow.campaign.dto.CampaignResponse;
import com.adflow.campaign.enums.CampaignStatus;

import java.util.List;

public interface CampaignService {
    List<CampaignResponse> getAllCampaigns(CampaignStatus status, Integer clientId, Integer managerId);
    CampaignResponse getCampaignById(Integer id);
    CampaignResponse createCampaign(CampaignRequest request);
    CampaignResponse updateCampaign(Integer id, CampaignRequest request);
    void deleteCampaign(Integer id);
}
