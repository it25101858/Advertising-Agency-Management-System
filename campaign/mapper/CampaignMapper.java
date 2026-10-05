package com.adflow.campaign.mapper;

import com.adflow.campaign.dto.CampaignResponse;
import com.adflow.campaign.entity.Campaign;
import org.springframework.stereotype.Component;

@Component
public class CampaignMapper {

    public CampaignResponse toResponse(Campaign entity) {
        if (entity == null) return null;
        CampaignResponse res = new CampaignResponse();
        res.setCampaignId(entity.getCampaignId());
        res.setCampaignName(entity.getCampaignName());
        if (entity.getClient() != null) {
            res.setClientId(entity.getClient().getUserId());
            res.setClientName(entity.getClient().getFullName());
        }
        if (entity.getManager() != null) {
            res.setManagerId(entity.getManager().getUserId());
            res.setManagerName(entity.getManager().getFullName());
        }
        res.setBudget(entity.getBudget());
        res.setSpentAmount(entity.getSpentAmount());
        res.setStartDate(entity.getStartDate());
        res.setEndDate(entity.getEndDate());
        res.setObjective(entity.getObjective());
        res.setCreativeBrief(entity.getCreativeBrief());
        res.setStatus(entity.getStatus());
        return res;
    }
}
