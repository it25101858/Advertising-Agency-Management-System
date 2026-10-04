package com.adflow.campaign.observer;

import com.adflow.campaign.entity.Campaign;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Concrete Observer: Notifies the Client regarding their Campaign milestones and status updates.
 */
@Component
public class ClientNotificationObserver implements CampaignObserver {

    private static final Logger log = LoggerFactory.getLogger(ClientNotificationObserver.class);

    @Override
    public String getObserverName() {
        return "Client Portal Notification Observer";
    }

    @Override
    public void onCampaignStateChanged(Campaign campaign, String previousState, String newState, String message) {
        String clientName = campaign.getClient() != null ? campaign.getClient().getFullName() : "Client";
        log.info("[Observer: ClientNotification] Sent update to Client '{}' for Campaign '{}': Status is now '{}' ({})",
                clientName, campaign.getCampaignName(), newState, message);
    }
}
