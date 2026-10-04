package com.adflow.campaign.state;

import com.adflow.campaign.entity.Campaign;

/**
 * ============================================================================
 * DESIGN PATTERN: STATE PATTERN (Behavioral Pattern)
 * ============================================================================
 * Purpose:
 * Encapsulates campaign lifecycle state-specific behaviors and state transitions.
 * Eliminates large nested if-else / switch condition code for workflow transitions.
 */
public interface CampaignState {

    String getStateName();

    void approve(CampaignStateContext context, Campaign campaign);

    void launch(CampaignStateContext context, Campaign campaign);

    void complete(CampaignStateContext context, Campaign campaign);

    void archive(CampaignStateContext context, Campaign campaign);
}
