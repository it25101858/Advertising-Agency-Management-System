package com.adflow.asset.mapper;

import com.adflow.asset.dto.AssetResponse;
import com.adflow.asset.entity.CreativeAsset;
import org.springframework.stereotype.Component;

@Component
public class AssetMapper {

    public AssetResponse toResponse(CreativeAsset asset) {
        if (asset == null) return null;
        AssetResponse res = new AssetResponse();
        res.setAssetId(asset.getAssetId());
        if (asset.getCampaign() != null) {
            res.setCampaignId(asset.getCampaign().getCampaignId());
            res.setCampaignName(asset.getCampaign().getCampaignName());
        }
        if (asset.getUploadedBy() != null) {
            res.setUploadedById(asset.getUploadedBy().getUserId());
            res.setUploadedByName(asset.getUploadedBy().getFullName());
        }
        res.setFileName(asset.getFileName());
        res.setFileType(asset.getFileType());
        res.setFileUrl(asset.getFileUrl());
        res.setFileSizeKb(asset.getFileSizeKb());
        res.setTags(asset.getTags());
        res.setCategory(asset.getCategory());
        res.setVersion(asset.getVersion());
        res.setApprovalStatus(asset.getApprovalStatus());
        res.setCreatedAt(asset.getCreatedAt());
        return res;
    }
}
