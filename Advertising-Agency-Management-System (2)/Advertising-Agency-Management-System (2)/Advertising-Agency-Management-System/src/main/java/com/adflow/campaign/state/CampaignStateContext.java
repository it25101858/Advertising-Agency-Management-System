package com.adflow.campaign.state;

import com.adflow.campaign.entity.Campaign;
import com.adflow.campaign.enums.CampaignStatus;

/**
 * State Context: Maintains current state reference and delegates lifecycle transitions.
 */
public class CampaignStateContext {

    private CampaignState currentState;

    public CampaignStateContext(Campaign campaign) {
        if (campaign == null || campaign.getStatus() == null) {
            this.currentState = new PlanningCampaignState();
            return;
        }

        switch (campaign.getStatus()) {
            case UPCOMING:
                this.currentState = new PlanningCampaignState();
                break;
            case ACTIVE:
                this.currentState = new ActiveCampaignState();
                break;
            case COMPLETED:
                this.currentState = new CompletedCampaignState();
                break;
            default:
                this.currentState = new PlanningCampaignState();
                break;
        }
    }

    public CampaignState getState() {
        return currentState;
    }

    public void setState(CampaignState state) {
        this.currentState = state;
    }

    public void approve(Campaign campaign) {
        this.currentState.approve(this, campaign);
    }

    public void launch(Campaign campaign) {
        this.currentState.launch(this, campaign);
    }

    public void complete(Campaign campaign) {
        this.currentState.complete(this, campaign);
    }

    public void archive(Campaign campaign) {
        this.currentState.archive(this, campaign);
    }
}
