package com.adflow.feedback.service;

import com.adflow.asset.entity.CreativeAsset;
import com.adflow.asset.repository.AssetRepository;
import com.adflow.campaign.entity.Campaign;
import com.adflow.campaign.repository.CampaignRepository;
import com.adflow.exception.BadRequestException;
import com.adflow.exception.ResourceNotFoundException;
import com.adflow.exception.UnauthorizedException;
import com.adflow.feedback.dto.FeedbackRequest;
import com.adflow.feedback.dto.FeedbackResponse;
import com.adflow.feedback.entity.Feedback;
import com.adflow.feedback.mapper.FeedbackMapper;
import com.adflow.feedback.repository.FeedbackRepository;
import com.adflow.task.entity.Task;
import com.adflow.task.repository.TaskRepository;
import com.adflow.user.entity.User;
import com.adflow.user.enums.UserRole;
import com.adflow.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final CampaignRepository campaignRepository;
    private final TaskRepository taskRepository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final FeedbackMapper feedbackMapper;

    public FeedbackServiceImpl(FeedbackRepository feedbackRepository,
                               CampaignRepository campaignRepository,
                               TaskRepository taskRepository,
                               AssetRepository assetRepository,
                               UserRepository userRepository,
                               FeedbackMapper feedbackMapper) {
        this.feedbackRepository = feedbackRepository;
        this.campaignRepository = campaignRepository;
        this.taskRepository = taskRepository;
        this.assetRepository = assetRepository;
        this.userRepository = userRepository;
        this.feedbackMapper = feedbackMapper;
    }

    @Override
    public List<FeedbackResponse> getFeedback(Integer campaignId, Integer clientId) {
        List<Feedback> list = feedbackRepository.findAll();
        return list.stream()
                .filter(f -> campaignId == null || (f.getCampaign() != null && f.getCampaign().getCampaignId().equals(campaignId)))
                .filter(f -> clientId == null || (f.getClient() != null && f.getClient().getUserId().equals(clientId)))
                .map(feedbackMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public FeedbackResponse getFeedbackById(Integer id) {
        Feedback fb = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with id: " + id));
        return feedbackMapper.toResponse(fb);
    }

    @Override
    @Transactional
    public FeedbackResponse submitFeedback(FeedbackRequest request, String currentUserEmail) {
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new BadRequestException("Rating must strictly be between 1 and 5 stars.");
        }

        Campaign campaign = campaignRepository.findById(request.getCampaignId())
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with id: " + request.getCampaignId()));
        User client = userRepository.findById(request.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + request.getClientId()));

        Task task = null;
        if (request.getTaskId() != null) task = taskRepository.findById(request.getTaskId()).orElse(null);

        CreativeAsset asset = null;
        if (request.getAssetId() != null) asset = assetRepository.findById(request.getAssetId()).orElse(null);

        Feedback feedback = new Feedback();
        feedback.setCampaign(campaign);
        feedback.setClient(client);
        feedback.setTask(task);
        feedback.setAsset(asset);
        feedback.setRating(request.getRating());
        feedback.setComments(request.getComments());
        feedback.setStatus(request.getStatus() != null ? request.getStatus() : "SUBMITTED");

        return feedbackMapper.toResponse(feedbackRepository.save(feedback));
    }

    @Override
    @Transactional
    public FeedbackResponse updateFeedback(Integer id, FeedbackRequest request, String currentUserEmail) {
        Feedback fb = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with id: " + id));

        // Client Author Restriction Rule
        if (currentUserEmail != null) {
            User currentUser = userRepository.findByEmail(currentUserEmail).orElse(null);
            if (currentUser != null && currentUser.getRole() == UserRole.CLIENT && !fb.getClient().getUserId().equals(currentUser.getUserId())) {
                throw new UnauthorizedException("Clients are permitted to edit only their own feedback.");
            }
        }

        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new BadRequestException("Rating must strictly be between 1 and 5 stars.");
        }

        fb.setRating(request.getRating());
        fb.setComments(request.getComments());
        if (request.getStatus() != null) fb.setStatus(request.getStatus());

        return feedbackMapper.toResponse(feedbackRepository.save(fb));
    }

    @Override
    @Transactional
    public void deleteFeedback(Integer id, String currentUserEmail) {
        Feedback fb = feedbackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with id: " + id));

        if (currentUserEmail != null) {
            User currentUser = userRepository.findByEmail(currentUserEmail).orElse(null);
            if (currentUser != null && currentUser.getRole() == UserRole.CLIENT && !fb.getClient().getUserId().equals(currentUser.getUserId())) {
                throw new UnauthorizedException("Clients cannot delete feedback submitted by others.");
            }
        }

        feedbackRepository.deleteById(id);
    }
}
