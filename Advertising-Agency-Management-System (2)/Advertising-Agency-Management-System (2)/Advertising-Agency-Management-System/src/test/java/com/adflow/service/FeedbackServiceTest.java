package com.adflow.service;

import com.adflow.asset.repository.AssetRepository;
import com.adflow.campaign.repository.CampaignRepository;
import com.adflow.exception.BadRequestException;
import com.adflow.feedback.dto.FeedbackRequest;
import com.adflow.feedback.mapper.FeedbackMapper;
import com.adflow.feedback.repository.FeedbackRepository;
import com.adflow.feedback.service.FeedbackServiceImpl;
import com.adflow.task.repository.TaskRepository;
import com.adflow.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertThrows;

@ExtendWith(MockitoExtension.class)
public class FeedbackServiceTest {

    @Mock
    private FeedbackRepository feedbackRepository;
    @Mock
    private CampaignRepository campaignRepository;
    @Mock
    private TaskRepository taskRepository;
    @Mock
    private AssetRepository assetRepository;
    @Mock
    private UserRepository userRepository;

    private FeedbackServiceImpl feedbackService;

    @BeforeEach
    void setUp() {
        feedbackService = new FeedbackServiceImpl(feedbackRepository, campaignRepository, taskRepository, assetRepository, userRepository, new FeedbackMapper());
    }

    @Test
    void testSubmitFeedback_InvalidRating_ThrowsBadRequestException() {
        FeedbackRequest req = new FeedbackRequest();
        req.setCampaignId(1);
        req.setClientId(1);
        req.setRating(6); // Invalid rating > 5
        req.setComments("Too high rating");

        assertThrows(BadRequestException.class, () -> feedbackService.submitFeedback(req, "client@dialog.lk"));
    }
}
