package com.adflow.feedback.mapper;

import com.adflow.feedback.dto.FeedbackResponse;
import com.adflow.feedback.entity.Feedback;
import org.springframework.stereotype.Component;

@Component
public class FeedbackMapper {

    public FeedbackResponse toResponse(Feedback entity) {
        if (entity == null) return null;
        FeedbackResponse res = new FeedbackResponse();
        res.setFeedbackId(entity.getFeedbackId());
        if (entity.getCampaign() != null) {
            res.setCampaignId(entity.getCampaign().getCampaignId());
            res.setCampaignName(entity.getCampaign().getCampaignName());
        }
        if (entity.getTask() != null) {
            res.setTaskId(entity.getTask().getTaskId());
            res.setTaskTitle(entity.getTask().getTitle());
        }
        if (entity.getAsset() != null) {
            res.setAssetId(entity.getAsset().getAssetId());
            res.setAssetName(entity.getAsset().getFileName());
        }
        if (entity.getClient() != null) {
            res.setClientId(entity.getClient().getUserId());
            res.setClientName(entity.getClient().getFullName());
        }
        res.setRating(entity.getRating());
        res.setComments(entity.getComments());
        res.setStatus(entity.getStatus());
        res.setCreatedAt(entity.getCreatedAt());
        return res;
    }
}
