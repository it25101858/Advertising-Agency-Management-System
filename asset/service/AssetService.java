package com.adflow.asset.service;

import com.adflow.asset.dto.AssetRequest;
import com.adflow.asset.dto.AssetResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AssetService {
    List<AssetResponse> getAssets(String category, Integer campaignId);
    AssetResponse getAssetById(Integer id);
    AssetResponse createAsset(AssetRequest request);
    AssetResponse uploadAsset(MultipartFile file, Integer campaignId, Integer uploadedById, String category, String tags);
    void deleteAsset(Integer id);
}
