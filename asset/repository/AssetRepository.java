package com.adflow.asset.repository;

import com.adflow.asset.entity.CreativeAsset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetRepository extends JpaRepository<CreativeAsset, Integer> {
    List<CreativeAsset> findByCategory(String category);
    List<CreativeAsset> findByCampaign_CampaignId(Integer campaignId);
    List<CreativeAsset> findByUploadedBy_UserId(Integer userId);
}
