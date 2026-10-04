package com.adflow.campaign.facade;

import com.adflow.campaign.builder.CampaignBuilder;
import com.adflow.campaign.dto.CampaignRequest;
import com.adflow.campaign.dto.CampaignResponse;
import com.adflow.campaign.entity.Campaign;
import com.adflow.campaign.enums.CampaignStatus;
import com.adflow.campaign.mapper.CampaignMapper;
import com.adflow.campaign.observer.CampaignEventPublisher;
import com.adflow.campaign.repository.CampaignRepository;
import com.adflow.campaign.state.CampaignStateContext;
import com.adflow.campaign.strategy.CampaignPricingContext;
import com.adflow.campaign.strategy.EnterpriseVolumeDiscountStrategy;
import com.adflow.campaign.strategy.SeasonalDiscountStrategy;
import com.adflow.campaign.strategy.StandardPricingStrategy;
import com.adflow.user.entity.User;
import com.adflow.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

/**
 * ============================================================================
 * DESIGN PATTERN: FACADE PATTERN (Structural Pattern)
 * ============================================================================
 * Purpose:
 * Provides a unified, simplified interface to a complex subsystem of Design Patterns:
 * 1. Builder Pattern (Constructs validated Campaign entity)
 * 2. Strategy Pattern (Calculates budget based on promotional/volume rules)
 * 3. State Pattern (Manages lifecycle transitions safely)
 * 4. Observer Pattern (Dispatches notifications to Project Manager & Client)
 */
@Service
public class CampaignWorkflowFacade {

    private final CampaignRepository campaignRepository;
    private final UserRepository userRepository;
    private final CampaignMapper campaignMapper;
    private final CampaignEventPublisher eventPublisher;
    private final CampaignPricingContext pricingContext;

    public CampaignWorkflowFacade(CampaignRepository campaignRepository,
                                  UserRepository userRepository,
                                  CampaignMapper campaignMapper,
                                  CampaignEventPublisher eventPublisher,
                                  CampaignPricingContext pricingContext) {
        this.campaignRepository = campaignRepository;
        this.userRepository = userRepository;
        this.campaignMapper = campaignMapper;
        this.eventPublisher = eventPublisher;
        this.pricingContext = pricingContext;
    }

    /**
     * Executes complete Campaign Onboarding & Lifecycle Creation using all 4 design patterns.
     */
    @Transactional
    public CampaignResponse executeCampaignCreationWorkflow(CampaignRequest request, String pricingStrategyType) {
        // 1. Resolve Client & Manager
        User client = userRepository.findById(request.getClientId())
                .orElseThrow(() -> new IllegalArgumentException("Client not found with ID: " + request.getClientId()));
        User manager = userRepository.findById(request.getManagerId())
                .orElseThrow(() -> new IllegalArgumentException("Manager not found with ID: " + request.getManagerId()));

        // 2. STRATEGY PATTERN: Apply Selected Pricing / Discount Strategy
        BigDecimal rawBudget = request.getBudget() != null ? request.getBudget() : BigDecimal.ZERO;
        if ("SEASONAL".equalsIgnoreCase(pricingStrategyType)) {
            pricingContext.setStrategy(new SeasonalDiscountStrategy());
        } else if ("ENTERPRISE".equalsIgnoreCase(pricingStrategyType)) {
            pricingContext.setStrategy(new EnterpriseVolumeDiscountStrategy());
        } else {
            pricingContext.setStrategy(new StandardPricingStrategy());
        }
        BigDecimal calculatedBudget = pricingContext.executePricingCalculation(rawBudget);

        // 3. BUILDER PATTERN: Fluently assemble validated Campaign object
        Campaign campaign = CampaignBuilder.builder()
                .withName(request.getCampaignName())
                .forClient(client)
                .managedBy(manager)
                .withBudget(calculatedBudget)
                .fromDate(request.getStartDate())
                .toDate(request.getEndDate())
                .withObjective(request.getObjective())
                .withCreativeBrief(request.getCreativeBrief())
                .withStatus(request.getStatus() != null ? request.getStatus() : CampaignStatus.UPCOMING)
                .build();

        // 4. Persist
        Campaign saved = campaignRepository.save(campaign);

        // 5. STATE PATTERN: Initialize and verify State Context
        CampaignStateContext stateContext = new CampaignStateContext(saved);

        // 6. OBSERVER PATTERN: Publish state change notification to Project Manager & Client
        eventPublisher.notifyObservers(
                saved,
                "NONE",
                saved.getStatus().name(),
                "Campaign created via " + pricingContext.getStrategy().getStrategyName() + " and routed to Project Manager."
        );

        return campaignMapper.toResponse(saved);
    }
}
