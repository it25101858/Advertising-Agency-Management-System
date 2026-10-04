package com.adflow.campaign.state;

import com.adflow.campaign.entity.Campaign;
import com.adflow.campaign.enums.CampaignStatus;

/**
 * Concrete State: Requested State (Client submitted, waiting for Project Manager review).
 */
public class RequestedCampaignState implements CampaignState {

    @Override
    public String getStateName() {
        return "REQUESTED";
    }

    @Override
    public void approve(CampaignStateContext context, Campaign campaign) {
        campaign.setStatus(CampaignStatus.UPCOMING);
        context.setState(new PlanningCampaignState());
    }

    @Override
    public void launch(CampaignStateContext context, Campaign campaign) {
        throw new IllegalStateException("Cannot launch a campaign directly from REQUESTED state. It must be approved first.");
    }

    @Override
    public void complete(CampaignStateContext context, Campaign campaign) {
        throw new IllegalStateException("Cannot complete a campaign in REQUESTED state.");
    }

    @Override
    public void archive(CampaignStateContext context, Campaign campaign) {
        campaign.setStatus(CampaignStatus.ARCHIVED);
    }
}
