package com.adflow.campaign.strategy;

import org.springframework.stereotype.Component;
import java.math.BigDecimal;

/**
 * Standard Strategy: No discount applied (100% rate).
 */
@Component("standardPricingStrategy")
public class StandardPricingStrategy implements CampaignPricingStrategy {

    @Override
    public String getStrategyName() {
        return "Standard Agency Pricing";
    }

    @Override
    public BigDecimal calculateFinalBudget(BigDecimal baseBudget) {
        return baseBudget != null ? baseBudget : BigDecimal.ZERO;
    }

    @Override
    public BigDecimal getDiscountPercentage() {
        return BigDecimal.ZERO;
    }
}
