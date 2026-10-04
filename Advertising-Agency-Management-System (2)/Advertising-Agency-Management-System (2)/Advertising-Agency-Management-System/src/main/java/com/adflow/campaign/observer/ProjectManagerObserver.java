package com.adflow.campaign.observer;

import com.adflow.campaign.entity.Campaign;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Concrete Observer: Notifies the Project Manager & Creative Team Lead
 * when campaigns are requested, approved, or changed.
 */
@Component
public class ProjectManagerObserver implements CampaignObserver {

    private static final Logger log = LoggerFactory.getLogger(ProjectManagerObserver.class);

    @Override
    public String getObserverName() {
        return "Project Manager / Task Lead Dispatcher";
    }

    @Override
    public void onCampaignStateChanged(Campaign campaign, String previousState, String newState, String message) {
        log.info("[Observer: ProjectManager] Campaign ID #{} ('{}') transitioned: [{}] -> [{}]. Action needed: {}",
                campaign.getCampaignId(), campaign.getCampaignName(), previousState, newState, message);
    }
}
