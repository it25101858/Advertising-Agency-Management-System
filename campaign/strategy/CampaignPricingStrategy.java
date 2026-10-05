package com.adflow.campaign.strategy;

import java.math.BigDecimal;

/**
 * ============================================================================
 * DESIGN PATTERN: STRATEGY PATTERN (Behavioral Pattern)
 * ============================================================================
 * Purpose:
 * Defines a family of interchangeable pricing algorithms for agency campaigns.
 * Enables selecting different discount & pricing calculation strategies at runtime
 * without modifying the campaign core logic (Open/Closed Principle).
 */
public interface CampaignPricingStrategy {

    String getStrategyName();

    /**
     * Calculates the final campaign cost / budget after applying strategy-specific discounts or multipliers.
     *
     * @param baseBudget The raw estimated budget
     * @return The final adjusted budget
     */
    BigDecimal calculateFinalBudget(BigDecimal baseBudget);

    /**
     * Percentage discount applied by this strategy.
     */
    BigDecimal getDiscountPercentage();
}
