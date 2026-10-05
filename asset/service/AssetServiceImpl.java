package com.adflow.asset.service;

import com.adflow.asset.dto.AssetRequest;
import com.adflow.asset.dto.AssetResponse;
import com.adflow.asset.entity.CreativeAsset;
import com.adflow.asset.mapper.AssetMapper;
import com.adflow.asset.repository.AssetRepository;
import com.adflow.campaign.entity.Campaign;
import com.adflow.campaign.repository.CampaignRepository;
import com.adflow.exception.BadRequestException;
import com.adflow.exception.ResourceNotFoundException;
import com.adflow.user.entity.User;
import com.adflow.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AssetServiceImpl implements AssetService {

    private final AssetRepository assetRepository;
    private final CampaignRepository campaignRepository;
    private final UserRepository userRepository;
    private final AssetMapper assetMapper;

    @Value("${app.upload.dir:uploads/assets/}")
    private String uploadDir;

    public AssetServiceImpl(AssetRepository assetRepository,
                            CampaignRepository campaignRepository,
                            UserRepository userRepository,
                            AssetMapper assetMapper) {
        this.assetRepository = assetRepository;
        this.campaignRepository = campaignRepository;
        this.userRepository = userRepository;
        this.assetMapper = assetMapper;
    }

    @Override
    public List<AssetResponse> getAssets(String category, Integer campaignId) {
        List<CreativeAsset> list = assetRepository.findAll();
        return list.stream()
                .filter(a -> category == null || a.getCategory().equalsIgnoreCase(category))
                .filter(a -> campaignId == null || (a.getCampaign() != null && a.getCampaign().getCampaignId().equals(campaignId)))
                .map(assetMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AssetResponse getAssetById(Integer id) {
        CreativeAsset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));
        return assetMapper.toResponse(asset);
    }

    @Override
    @Transactional
    public AssetResponse createAsset(AssetRequest request) {
        Campaign campaign = campaignRepository.findById(request.getCampaignId())
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with id: " + request.getCampaignId()));
        User user = userRepository.findById(request.getUploadedById())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUploadedById()));

        CreativeAsset asset = new CreativeAsset();
        asset.setCampaign(campaign);
        asset.setUploadedBy(user);
        asset.setFileName(request.getFileName());
        asset.setFileType(request.getFileType() != null ? request.getFileType() : "application/octet-stream");
        asset.setFileUrl(request.getFileUrl() != null ? request.getFileUrl() : "/uploads/" + request.getFileName());
        asset.setFileSizeKb(request.getFileSizeKb());
        asset.setTags(request.getTags());
        asset.setCategory(request.getCategory() != null ? request.getCategory() : "IMAGE");
        asset.setVersion(request.getVersion() != null ? request.getVersion() : "v1.0");
        asset.setApprovalStatus(request.getApprovalStatus() != null ? request.getApprovalStatus() : "PENDING");

        return assetMapper.toResponse(assetRepository.save(asset));
    }

    @Override
    @Transactional
    public AssetResponse uploadAsset(MultipartFile file, Integer campaignId, Integer uploadedById, String category, String tags) {
        if (file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be empty");
        }
        try {
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String origName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "asset_" + System.currentTimeMillis();
            String uniqueName = UUID.randomUUID().toString() + "_" + origName;
            Path targetPath = Paths.get(uploadDir, uniqueName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            AssetRequest req = new AssetRequest();
            req.setCampaignId(campaignId);
            req.setUploadedById(uploadedById);
            req.setFileName(origName);
            req.setFileType(file.getContentType());
            req.setFileUrl("/uploads/" + uniqueName);
            req.setFileSizeKb((int) (file.getSize() / 1024));
            req.setCategory(category != null ? category : "IMAGE");
            req.setTags(tags);

            return createAsset(req);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public void deleteAsset(Integer id) {
        if (!assetRepository.existsById(id)) {
            throw new ResourceNotFoundException("Asset not found with id: " + id);
        }
        assetRepository.deleteById(id);
    }
}
