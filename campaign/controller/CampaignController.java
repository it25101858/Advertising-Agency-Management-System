package com.adflow.campaign.controller;

import com.adflow.campaign.dto.CampaignRequest;
import com.adflow.campaign.dto.CampaignResponse;
import com.adflow.campaign.enums.CampaignStatus;
import com.adflow.campaign.service.CampaignService;
import com.adflow.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/campaigns", "/campaigns_api"})
public class CampaignController {

    private final CampaignService campaignService;

    public CampaignController(CampaignService campaignService) {
        this.campaignService = campaignService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CampaignResponse>>> getAllCampaigns(
            @RequestParam(required = false) CampaignStatus status,
            @RequestParam(required = false) Integer clientId,
            @RequestParam(required = false) Integer managerId) {
        return ResponseEntity.ok(ApiResponse.ok(campaignService.getAllCampaigns(status, clientId, managerId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CampaignResponse>> getCampaignById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.ok(campaignService.getCampaignById(id)));
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<CampaignResponse>> createCampaign(@Valid @RequestBody CampaignRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Campaign created successfully", campaignService.createCampaign(request)));
    }

    @PostMapping(consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> handleFormAction(@RequestParam Map<String, String> params) {
        String action = params.getOrDefault("action", "CREATE");

        if ("DELETE".equalsIgnoreCase(action) || "DELETE_DRAFT".equalsIgnoreCase(action)) {
            String idStr = params.get("campaignId");
            if (idStr == null) idStr = params.get("id");
            if (idStr != null) {
                campaignService.deleteCampaign(Integer.parseInt(idStr));
                return ResponseEntity.ok(ApiResponse.ok("Campaign deleted", null));
            }
        }

        CampaignRequest req = new CampaignRequest();
        String cName = params.get("campaignName") != null ? params.get("campaignName") : (params.get("title") != null ? params.get("title") : params.get("name"));
        req.setCampaignName(cName != null ? cName : "New Campaign");
        req.setClientId(params.get("clientId") != null ? Integer.parseInt(params.get("clientId")) : 1);
        req.setManagerId(params.get("managerId") != null ? Integer.parseInt(params.get("managerId")) : 3);
        if (params.get("budget") != null) req.setBudget(new BigDecimal(params.get("budget")));
        if (params.get("startDate") != null) req.setStartDate(LocalDate.parse(params.get("startDate")));
        if (params.get("endDate") != null) req.setEndDate(LocalDate.parse(params.get("endDate")));
        req.setObjective(params.get("objective"));
        req.setCreativeBrief(params.get("creativeBrief"));
        if (params.get("status") != null && !params.get("status").trim().isEmpty()) {
            try {
                req.setStatus(CampaignStatus.valueOf(params.get("status").trim().toUpperCase()));
            } catch (Exception e) {
                req.setStatus(CampaignStatus.UPCOMING);
            }
        } else {
            req.setStatus(CampaignStatus.UPCOMING);
        }

        if ("UPDATE".equalsIgnoreCase(action)) {
            String idStr = params.get("campaignId");
            if (idStr == null) idStr = params.get("id");
            Integer id = Integer.parseInt(idStr);
            return ResponseEntity.ok(ApiResponse.ok("Campaign updated", campaignService.updateCampaign(id, req)));
        }

        return ResponseEntity.ok(ApiResponse.ok("Campaign created", campaignService.createCampaign(req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CampaignResponse>> updateCampaign(@PathVariable Integer id, @Valid @RequestBody CampaignRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Campaign updated successfully", campaignService.updateCampaign(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCampaign(@PathVariable Integer id) {
        campaignService.deleteCampaign(id);
        return ResponseEntity.ok(ApiResponse.ok("Campaign deleted successfully", null));
    }
}
