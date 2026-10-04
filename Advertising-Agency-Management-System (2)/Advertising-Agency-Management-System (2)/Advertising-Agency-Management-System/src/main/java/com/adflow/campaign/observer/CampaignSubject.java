package com.adflow.campaign.observer;

import com.adflow.campaign.entity.Campaign;

/**
 * Subject interface for managing CampaignObservers.
 */
public interface CampaignSubject {

    void attachObserver(CampaignObserver observer);

    void detachObserver(CampaignObserver observer);

    void notifyObservers(Campaign campaign, String previousState, String newState, String message);
}
