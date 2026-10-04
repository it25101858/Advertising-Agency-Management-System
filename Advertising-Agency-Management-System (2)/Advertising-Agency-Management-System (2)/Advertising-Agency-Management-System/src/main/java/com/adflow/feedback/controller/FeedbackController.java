package com.adflow.feedback.controller;

import com.adflow.common.ApiResponse;
import com.adflow.feedback.dto.FeedbackRequest;
import com.adflow.feedback.dto.FeedbackResponse;
import com.adflow.feedback.service.FeedbackService;
import com.adflow.security.SecurityUtils;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<FeedbackResponse>>> getFeedback(
            @RequestParam(required = false) Integer campaignId,
            @RequestParam(required = false) Integer clientId) {
        return ResponseEntity.ok(ApiResponse.ok(feedbackService.getFeedback(campaignId, clientId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FeedbackResponse>> getFeedbackById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.ok(feedbackService.getFeedbackById(id)));
    }

    @PostMapping(consumes = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<FeedbackResponse>> submitFeedback(@Valid @RequestBody FeedbackRequest request) {
        String email = SecurityUtils.getCurrentUserEmail();
        return ResponseEntity.ok(ApiResponse.ok("Feedback submitted", feedbackService.submitFeedback(request, email)));
    }

    @PostMapping(consumes = org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> handleFormAction(@RequestParam java.util.Map<String, String> params) {
        String action = params.getOrDefault("action", "CREATE");
        String email = SecurityUtils.getCurrentUserEmail();
        if (email == null || email.isEmpty() || email.equalsIgnoreCase("anonymousUser")) {
            email = "client@dialog.lk"; // Default fallback for anonymous/form client submissions
        }

        if ("DELETE".equalsIgnoreCase(action)) {
            String idStr = params.get("feedbackId");
            if (idStr == null) idStr = params.get("id");
            if (idStr != null) {
                feedbackService.deleteFeedback(Integer.parseInt(idStr), email);
                return ResponseEntity.ok(ApiResponse.ok("Feedback deleted", null));
            }
        }

        if ("UPDATE".equalsIgnoreCase(action) || "UPDATE_STATUS".equalsIgnoreCase(action)) {
            String idStr = params.get("feedbackId");
            if (idStr == null) idStr = params.get("id");
            if (idStr != null) {
                Integer id = Integer.parseInt(idStr);
                FeedbackResponse existing = feedbackService.getFeedbackById(id);
                FeedbackRequest req = new FeedbackRequest();
                req.setCampaignId(existing.getCampaignId());
                req.setRating(params.get("rating") != null ? Integer.parseInt(params.get("rating")) : existing.getRating());
                req.setComments(params.get("comments") != null ? params.get("comments") : existing.getComments());
                req.setStatus(params.getOrDefault("status", "RESOLVED"));
                return ResponseEntity.ok(ApiResponse.ok("Feedback updated", feedbackService.updateFeedback(id, req, email)));
            }
        }

        FeedbackRequest req = new FeedbackRequest();
        req.setCampaignId(params.get("campaignId") != null ? Integer.parseInt(params.get("campaignId")) : 1);
        if (params.get("taskId") != null && !params.get("taskId").isEmpty()) {
            req.setTaskId(Integer.parseInt(params.get("taskId")));
        }
        if (params.get("assetId") != null && !params.get("assetId").isEmpty()) {
            req.setAssetId(Integer.parseInt(params.get("assetId")));
        }
        req.setRating(params.get("rating") != null ? Integer.parseInt(params.get("rating")) : 5);
        req.setComments(params.getOrDefault("comments", "Great work!"));
        req.setStatus(params.getOrDefault("status", "SUBMITTED"));

        return ResponseEntity.ok(ApiResponse.ok("Feedback submitted", feedbackService.submitFeedback(req, email)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FeedbackResponse>> updateFeedback(@PathVariable Integer id, @Valid @RequestBody FeedbackRequest request) {
        String email = SecurityUtils.getCurrentUserEmail();
        return ResponseEntity.ok(ApiResponse.ok("Feedback updated", feedbackService.updateFeedback(id, request, email)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteFeedback(@PathVariable Integer id) {
        String email = SecurityUtils.getCurrentUserEmail();
        feedbackService.deleteFeedback(id, email);
        return ResponseEntity.ok(ApiResponse.ok("Feedback deleted", null));
    }
}
