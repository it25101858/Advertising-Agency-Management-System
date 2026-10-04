package com.adflow.campaign.state;

import com.adflow.campaign.entity.Campaign;
import com.adflow.campaign.enums.CampaignStatus;

/**
 * Concrete State: Planning State (Approved / Upcoming, tasks being assigned).
 */
public class PlanningCampaignState implements CampaignState {

    @Override
    public String getStateName() {
        return "UPCOMING / PLANNING";
    }

    @Override
    public void approve(CampaignStateContext context, Campaign campaign) {
        // Already approved
    }

    @Override
    public void launch(CampaignStateContext context, Campaign campaign) {
        campaign.setStatus(CampaignStatus.ACTIVE);
        context.setState(new ActiveCampaignState());
    }

    @Override
    public void complete(CampaignStateContext context, Campaign campaign) {
        throw new IllegalStateException("Cannot mark a campaign in planning stage as completed before launching.");
    }

    @Override
    public void archive(CampaignStateContext context, Campaign campaign) {
        campaign.setStatus(CampaignStatus.ARCHIVED);
    }
}
