package com.adflow.campaign.observer;

import com.adflow.campaign.entity.Campaign;

/**
 * ============================================================================
 * DESIGN PATTERN: OBSERVER PATTERN (Behavioral Pattern)
 * ============================================================================
 * Purpose:
 * Defines a one-to-many dependency between objects so that when a Campaign state
 * changes (e.g. Requested -> Approved -> In Progress -> Completed), all registered
 * observers (Project Manager, Client, Finance) are automatically notified.
 */
public interface CampaignObserver {

    String getObserverName();

    void onCampaignStateChanged(Campaign campaign, String previousState, String newState, String message);
}
