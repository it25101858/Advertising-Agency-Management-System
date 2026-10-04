package com.adflow.asset.controller;

import com.adflow.asset.dto.AssetRequest;
import com.adflow.asset.dto.AssetResponse;
import com.adflow.asset.service.AssetService;
import com.adflow.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AssetResponse>>> getAssets(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Integer campaignId) {
        return ResponseEntity.ok(ApiResponse.ok(assetService.getAssets(category, campaignId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AssetResponse>> getAssetById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.ok(assetService.getAssetById(id)));
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<AssetResponse>> createAsset(@Valid @RequestBody AssetRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Asset registered", assetService.createAsset(request)));
    }

    @PostMapping(consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> handleFormAction(@RequestParam java.util.Map<String, String> params) {
        String action = params.getOrDefault("action", "CREATE");

        if ("DELETE".equalsIgnoreCase(action)) {
            String idStr = params.get("assetId");
            if (idStr == null) idStr = params.get("id");
            if (idStr != null) {
                assetService.deleteAsset(Integer.parseInt(idStr));
                return ResponseEntity.ok(ApiResponse.ok("Asset deleted", null));
            }
        }

        AssetRequest req = new AssetRequest();
        req.setCampaignId(params.get("campaignId") != null ? Integer.parseInt(params.get("campaignId")) : 1);
        req.setUploadedById(params.get("uploadedById") != null ? Integer.parseInt(params.get("uploadedById")) : 5);
        req.setFileName(params.getOrDefault("fileName", "Creative_Asset_" + System.currentTimeMillis() + ".png"));
        req.setFileType(params.getOrDefault("fileType", "image/png"));
        req.setFileUrl(params.getOrDefault("fileUrl", "/static/images/portfolio/portfolio-1.jpg"));
        req.setFileSizeKb(params.get("fileSizeKb") != null ? Integer.parseInt(params.get("fileSizeKb")) : 2048);
        req.setCategory(params.getOrDefault("category", "IMAGE"));
        req.setTags(params.get("tags"));
        req.setVersion(params.getOrDefault("version", "v1.0"));

        return ResponseEntity.ok(ApiResponse.ok("Asset created", assetService.createAsset(req)));
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<AssetResponse>> uploadAsset(
            @RequestParam("file") MultipartFile file,
            @RequestParam("campaignId") Integer campaignId,
            @RequestParam("uploadedById") Integer uploadedById,
            @RequestParam(value = "category", defaultValue = "IMAGE") String category,
            @RequestParam(value = "tags", required = false) String tags) {
        return ResponseEntity.ok(ApiResponse.ok("File uploaded successfully",
                assetService.uploadAsset(file, campaignId, uploadedById, category, tags)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAsset(@PathVariable Integer id) {
        assetService.deleteAsset(id);
        return ResponseEntity.ok(ApiResponse.ok("Asset deleted successfully", null));
    }
}
