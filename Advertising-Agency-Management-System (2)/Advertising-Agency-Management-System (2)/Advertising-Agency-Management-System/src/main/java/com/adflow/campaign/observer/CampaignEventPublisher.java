package com.adflow.campaign.observer;

import com.adflow.campaign.entity.Campaign;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Concrete Subject for Observer Pattern:
 * Holds registered observers and notifies them upon state changes or events.
 */
@Service
public class CampaignEventPublisher implements CampaignSubject {

    private final List<CampaignObserver> observers = new ArrayList<>();

    public CampaignEventPublisher(List<CampaignObserver> initialObservers) {
        if (initialObservers != null) {
            this.observers.addAll(initialObservers);
        }
    }

    @Override
    public synchronized void attachObserver(CampaignObserver observer) {
        if (observer != null && !observers.contains(observer)) {
            observers.add(observer);
        }
    }

    @Override
    public synchronized void detachObserver(CampaignObserver observer) {
        observers.remove(observer);
    }

    @Override
    public void notifyObservers(Campaign campaign, String previousState, String newState, String message) {
        for (CampaignObserver observer : observers) {
            try {
                observer.onCampaignStateChanged(campaign, previousState, newState, message);
            } catch (Exception e) {
                // Prevent single observer failure from interrupting notification pipeline
                System.err.println("Error notifying observer " + observer.getObserverName() + ": " + e.getMessage());
            }
        }
    }
}
