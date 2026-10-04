package com.adflow.campaign.dto;

import com.adflow.campaign.enums.CampaignStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public class CampaignRequest {

    @NotBlank(message = "Campaign Name is required")
    @Size(min = 3, max = 100, message = "Campaign Name must be between 3 and 100 characters")
    private String campaignName;

    @NotNull(message = "Client ID is required")
    private Integer clientId;

    @NotNull(message = "Manager ID is required")
    private Integer managerId;

    @NotNull(message = "Budget is required")
    @DecimalMin(value = "0.01", message = "Budget must be greater than LKR 0.00")
    private BigDecimal budget;

    @NotNull(message = "Start Date is required")
    private LocalDate startDate;

    @NotNull(message = "End Date is required")
    private LocalDate endDate;

    private String objective;
    private String creativeBrief;
    private CampaignStatus status = CampaignStatus.UPCOMING;

    public String getCampaignName() { return campaignName; }
    public void setCampaignName(String campaignName) { this.campaignName = campaignName; }

    public Integer getClientId() { return clientId; }
    public void setClientId(Integer clientId) { this.clientId = clientId; }

    public Integer getManagerId() { return managerId; }
    public void setManagerId(Integer managerId) { this.managerId = managerId; }

    public BigDecimal getBudget() { return budget; }
    public void setBudget(BigDecimal budget) { this.budget = budget; }

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
}
