package com.adflow.campaign.strategy;

import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * Seasonal Discount Strategy: Applies an 8% seasonal promotional discount.
 */
@Component("seasonalDiscountStrategy")
public class SeasonalDiscountStrategy implements CampaignPricingStrategy {

    private static final BigDecimal DISCOUNT_RATE = new BigDecimal("0.08"); // 8%

    @Override
    public String getStrategyName() {
        return "Seasonal Promotion Discount (8% OFF)";
    }

    @Override
    public BigDecimal calculateFinalBudget(BigDecimal baseBudget) {
        if (baseBudget == null || baseBudget.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        BigDecimal discount = baseBudget.multiply(DISCOUNT_RATE);
        return baseBudget.subtract(discount).setScale(2, RoundingMode.HALF_UP);
    }

    @Override
    public BigDecimal getDiscountPercentage() {
        return new BigDecimal("8.00");
    }
}
