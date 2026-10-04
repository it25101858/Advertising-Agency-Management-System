package com.adflow.asset.dto;

import java.time.LocalDateTime;

public class AssetResponse {
    private Integer assetId;
    private Integer campaignId;
    private String campaignName;
    private Integer uploadedById;
    private String uploadedByName;
    private String fileName;
    private String fileType;
    private String fileUrl;
    private Integer fileSizeKb;
    private String tags;
    private String category;
    private String version;
    private String approvalStatus;
    private LocalDateTime createdAt;

    public Integer getAssetId() { return assetId; }
    public void setAssetId(Integer assetId) { this.assetId = assetId; }

    public Integer getCampaignId() { return campaignId; }
    public void setCampaignId(Integer campaignId) { this.campaignId = campaignId; }

    public String getCampaignName() { return campaignName; }
    public void setCampaignName(String campaignName) { this.campaignName = campaignName; }

    public Integer getUploadedById() { return uploadedById; }
    public void setUploadedById(Integer uploadedById) { this.uploadedById = uploadedById; }

    public String getUploadedByName() { return uploadedByName; }
    public void setUploadedByName(String uploadedByName) { this.uploadedByName = uploadedByName; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public Integer getFileSizeKb() { return fileSizeKb; }
    public void setFileSizeKb(Integer fileSizeKb) { this.fileSizeKb = fileSizeKb; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // Frontend compatibility aliases
    public Integer getId() { return assetId; }
    public String getName() { return fileName; }
    public String getCampaign() { return campaignName; }
    public String getUploader() { return uploadedByName; }
}
