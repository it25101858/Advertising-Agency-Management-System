package com.adflow.feedback.service;

import com.adflow.feedback.dto.FeedbackRequest;
import com.adflow.feedback.dto.FeedbackResponse;

import java.util.List;

public interface FeedbackService {
    List<FeedbackResponse> getFeedback(Integer campaignId, Integer clientId);
    FeedbackResponse getFeedbackById(Integer id);
    FeedbackResponse submitFeedback(FeedbackRequest request, String currentUserEmail);
    FeedbackResponse updateFeedback(Integer id, FeedbackRequest request, String currentUserEmail);
    void deleteFeedback(Integer id, String currentUserEmail);
}
