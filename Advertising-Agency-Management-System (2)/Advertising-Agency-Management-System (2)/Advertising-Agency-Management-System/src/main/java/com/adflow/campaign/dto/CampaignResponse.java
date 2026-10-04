package com.adflow.campaign.dto;

import com.adflow.campaign.enums.CampaignStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CampaignResponse {
    private Integer campaignId;
    private String campaignName;
    private Integer clientId;
    private String clientName;
    private Integer managerId;
    private String managerName;
    private BigDecimal budget;
    private BigDecimal spentAmount;
    private LocalDate startDate;
    private LocalDate endDate;
    private String objective;
    private String creativeBrief;
    private CampaignStatus status;

    public Integer getCampaignId() { return campaignId; }
    public void setCampaignId(Integer campaignId) { this.campaignId = campaignId; }

    public String getCampaignName() { return campaignName; }
    public void setCampaignName(String campaignName) { this.campaignName = campaignName; }

    public Integer getClientId() { return clientId; }
    public void setClientId(Integer clientId) { this.clientId = clientId; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public Integer getManagerId() { return managerId; }
    public void setManagerId(Integer managerId) { this.managerId = managerId; }

    public String getManagerName() { return managerName; }
    public void setManagerName(String managerName) { this.managerName = managerName; }

    public BigDecimal getBudget() { return budget; }
    public void setBudget(BigDecimal budget) { this.budget = budget; }

    public BigDecimal getSpentAmount() { return spentAmount; }
    public void setSpentAmount(BigDecimal spentAmount) { this.spentAmount = spentAmount; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }

    public String getObjective() { return objective; }
    public void setObjective(String objective) { this.objective = objective; }

    public String getCreativeBrief() { return creativeBrief; }
    public void setCreativeBrief(String creativeBrief) { this.creativeBrief = creativeBrief; }

    public CampaignStatus getStatus() { return status; }
    public void setStatus(CampaignStatus status) { this.status = status; }

    // Frontend compatibility aliases
    public Integer getId() { return campaignId; }
    public String getTitle() { return campaignName; }
    public String getClient() { return clientName; }
    public String getManager() { return managerName; }
    public String getStart() { return startDate != null ? startDate.toString() : null; }
    public String getEnd() { return endDate != null ? endDate.toString() : null; }
    public String getBrief() { return creativeBrief; }
}
