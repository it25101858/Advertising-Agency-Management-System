package com.adflow.campaign.state;

import com.adflow.campaign.entity.Campaign;
import com.adflow.campaign.enums.CampaignStatus;

/**
 * Concrete State: Completed State (Campaign goals achieved, ready for reporting/archival).
 */
public class CompletedCampaignState implements CampaignState {

    @Override
    public String getStateName() {
        return "COMPLETED";
    }

    @Override
    public void approve(CampaignStateContext context, Campaign campaign) {
        // Already past approval
    }

    @Override
    public void launch(CampaignStateContext context, Campaign campaign) {
        throw new IllegalStateException("Cannot re-launch a completed campaign without resetting status.");
    }

    @Override
    public void complete(CampaignStateContext context, Campaign campaign) {
        // Already completed
    }

    @Override
    public void archive(CampaignStateContext context, Campaign campaign) {
        campaign.setStatus(CampaignStatus.ARCHIVED);
    }
}
