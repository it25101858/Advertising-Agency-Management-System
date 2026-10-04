package com.adflow.campaign.strategy;

import org.springframework.stereotype.Service;
import java.math.BigDecimal;

/**
 * Strategy Context: Maintains a reference to one of the concrete Strategy objects
 * and executes the calculation.
 */
@Service
public class CampaignPricingContext {

    private CampaignPricingStrategy strategy;

    public CampaignPricingContext() {
        // Default strategy
        this.strategy = new StandardPricingStrategy();
    }

    public CampaignPricingContext(CampaignPricingStrategy strategy) {
        this.strategy = strategy;
    }

    public void setStrategy(CampaignPricingStrategy strategy) {
        this.strategy = strategy;
    }

    public CampaignPricingStrategy getStrategy() {
        return this.strategy;
    }

    public BigDecimal executePricingCalculation(BigDecimal baseBudget) {
        if (this.strategy == null) {
            return baseBudget;
        }
        return this.strategy.calculateFinalBudget(baseBudget);
    }
}
