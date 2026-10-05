package com.adflow.feedback.dto;

import java.time.LocalDateTime;

public class FeedbackResponse {
    private Integer feedbackId;
    private Integer campaignId;
    private String campaignName;
    private Integer taskId;
    private String taskTitle;
    private Integer assetId;
    private String assetName;
    private Integer clientId;
    private String clientName;
    private Integer rating;
    private String comments;
    private String status;
    private LocalDateTime createdAt;

    public Integer getFeedbackId() { return feedbackId; }
    public void setFeedbackId(Integer feedbackId) { this.feedbackId = feedbackId; }

    public Integer getCampaignId() { return campaignId; }
    public void setCampaignId(Integer campaignId) { this.campaignId = campaignId; }

    public String getCampaignName() { return campaignName; }
    public void setCampaignName(String campaignName) { this.campaignName = campaignName; }

    public Integer getTaskId() { return taskId; }
    public void setTaskId(Integer taskId) { this.taskId = taskId; }

    public String getTaskTitle() { return taskTitle; }
    public void setTaskTitle(String taskTitle) { this.taskTitle = taskTitle; }

    public Integer getAssetId() { return assetId; }
    public void setAssetId(Integer assetId) { this.assetId = assetId; }

    public String getAssetName() { return assetName; }
    public void setAssetName(String assetName) { this.assetName = assetName; }

    public Integer getClientId() { return clientId; }
    public void setClientId(Integer clientId) { this.clientId = clientId; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Frontend compatibility aliases
    public Integer getId() { return feedbackId; }
    public String getClient() { return clientName; }
    public String getCampaign() { return campaignName; }
}
