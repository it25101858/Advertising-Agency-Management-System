package com.adflow.campaign.builder;

import com.adflow.campaign.entity.Campaign;
import com.adflow.campaign.enums.CampaignStatus;
import com.adflow.user.entity.User;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * ============================================================================
 * DESIGN PATTERN: BUILDER PATTERN (Creational Pattern)
 * ============================================================================
 * Purpose:
 * Provides a flexible, fluent step-by-step construction of complex Campaign objects.
 * Prevents telescoping constructors and ensures validation before building.
 *
 * Applicable Viva Points:
 * - Solves the anti-pattern of having large constructors with many optional parameters.
 * - Allows immutable or strictly validated construction of Campaign entities.
 */
public class CampaignBuilder {

    private final Campaign campaign;

    public CampaignBuilder() {
        this.campaign = new Campaign();
        this.campaign.setBudget(BigDecimal.ZERO);
        this.campaign.setSpentAmount(BigDecimal.ZERO);
        this.campaign.setStatus(CampaignStatus.UPCOMING);
    }

    public static CampaignBuilder builder() {
        return new CampaignBuilder();
    }

    public CampaignBuilder withId(Integer id) {
        this.campaign.setCampaignId(id);
        return this;
    }

    public CampaignBuilder withName(String name) {
        this.campaign.setCampaignName(name);
        return this;
    }

    public CampaignBuilder forClient(User client) {
        this.campaign.setClient(client);
        return this;
    }

    public CampaignBuilder managedBy(User manager) {
        this.campaign.setManager(manager);
        return this;
    }

    public CampaignBuilder withBudget(BigDecimal budget) {
        this.campaign.setBudget(budget != null ? budget : BigDecimal.ZERO);
        return this;
    }

    public CampaignBuilder withSpentAmount(BigDecimal spent) {
        this.campaign.setSpentAmount(spent != null ? spent : BigDecimal.ZERO);
        return this;
    }

    public CampaignBuilder fromDate(LocalDate startDate) {
        this.campaign.setStartDate(startDate);
        return this;
    }

    public CampaignBuilder toDate(LocalDate endDate) {
        this.campaign.setEndDate(endDate);
        return this;
    }

    public CampaignBuilder withObjective(String objective) {
        this.campaign.setObjective(objective);
        return this;
    }

    public CampaignBuilder withCreativeBrief(String creativeBrief) {
        this.campaign.setCreativeBrief(creativeBrief);
        return this;
    }

    public CampaignBuilder withStatus(CampaignStatus status) {
        this.campaign.setStatus(status != null ? status : CampaignStatus.UPCOMING);
        return this;
    }

    /**
     * Final build method with validation safeguards
     */
    public Campaign build() {
        if (campaign.getCampaignName() == null || campaign.getCampaignName().trim().isEmpty()) {
            throw new IllegalStateException("Campaign name cannot be null or empty in CampaignBuilder");
        }
        if (campaign.getStartDate() != null && campaign.getEndDate() != null) {
            if (campaign.getEndDate().isBefore(campaign.getStartDate())) {
                throw new IllegalStateException("Campaign end date cannot be earlier than start date");
            }
        }
        return this.campaign;
    }
}
