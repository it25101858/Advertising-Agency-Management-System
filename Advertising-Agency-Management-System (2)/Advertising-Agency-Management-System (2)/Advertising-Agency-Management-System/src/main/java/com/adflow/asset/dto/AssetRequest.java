package com.adflow.asset.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AssetRequest {
    @NotNull(message = "Campaign ID is required")
    private Integer campaignId;

    @NotNull(message = "Uploaded By User ID is required")
    private Integer uploadedById;

    @NotBlank(message = "File Name is required")
    private String fileName;

    private String fileType;
    private String fileUrl;
    private Integer fileSizeKb = 0;
    private String tags;
    private String category = "IMAGE";
    private String version = "v1.0";
    private String approvalStatus = "PENDING";

    public Integer getCampaignId() { return campaignId; }
    public void setCampaignId(Integer campaignId) { this.campaignId = campaignId; }

    public Integer getUploadedById() { return uploadedById; }
    public void setUploadedById(Integer uploadedById) { this.uploadedById = uploadedById; }

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
}
