package com.adflow.campaign.state;

import com.adflow.campaign.entity.Campaign;
import com.adflow.campaign.enums.CampaignStatus;

/**
 * Concrete State: Active State (Campaign is currently running in market).
 */
public class ActiveCampaignState implements CampaignState {

    @Override
    public String getStateName() {
        return "ACTIVE";
    }

    @Override
    public void approve(CampaignStateContext context, Campaign campaign) {
        // Already active
    }

    @Override
    public void launch(CampaignStateContext context, Campaign campaign) {
        // Already launched
    }

    @Override
    public void complete(CampaignStateContext context, Campaign campaign) {
        campaign.setStatus(CampaignStatus.COMPLETED);
        context.setState(new CompletedCampaignState());
    }

    @Override
    public void archive(CampaignStateContext context, Campaign campaign) {
        campaign.setStatus(CampaignStatus.ARCHIVED);
    }
}
