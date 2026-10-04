package com.adflow.campaign.service;

import com.adflow.campaign.dto.CampaignRequest;
import com.adflow.campaign.dto.CampaignResponse;
import com.adflow.campaign.entity.Campaign;
import com.adflow.campaign.enums.CampaignStatus;
import com.adflow.campaign.mapper.CampaignMapper;
import com.adflow.campaign.repository.CampaignRepository;
import com.adflow.exception.BadRequestException;
import com.adflow.exception.ConflictException;
import com.adflow.exception.ResourceNotFoundException;
import com.adflow.user.entity.User;
import com.adflow.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CampaignServiceImpl implements CampaignService {

    private final CampaignRepository campaignRepository;
    private final UserRepository userRepository;
    private final CampaignMapper campaignMapper;

    public CampaignServiceImpl(CampaignRepository campaignRepository,
                               UserRepository userRepository,
                               CampaignMapper campaignMapper) {
        this.campaignRepository = campaignRepository;
        this.userRepository = userRepository;
        this.campaignMapper = campaignMapper;
    }

    @Override
    public List<CampaignResponse> getAllCampaigns(CampaignStatus status, Integer clientId, Integer managerId) {
        if (status != null) {
            return campaignRepository.findByStatus(status).stream().map(campaignMapper::toResponse).collect(Collectors.toList());
        }
        if (clientId != null) {
            return campaignRepository.findByClient_UserId(clientId).stream().map(campaignMapper::toResponse).collect(Collectors.toList());
        }
        if (managerId != null) {
            return campaignRepository.findByManager_UserId(managerId).stream().map(campaignMapper::toResponse).collect(Collectors.toList());
        }
        return campaignRepository.findAll().stream().map(campaignMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public CampaignResponse getCampaignById(Integer id) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with id: " + id));
        return campaignMapper.toResponse(campaign);
    }

    @Override
    @Transactional
    public CampaignResponse createCampaign(CampaignRequest request) {
        // Business Rule 1: End Date after Start Date
        if (!request.getEndDate().isAfter(request.getStartDate())) {
            throw new BadRequestException("Validation Error: End date must strictly be after start date.");
        }

        // Business Rule 2: Uniqueness of Campaign Name for Client
        if (campaignRepository.existsByClient_UserIdAndCampaignNameIgnoreCase(request.getClientId(), request.getCampaignName())) {
            throw new ConflictException("A campaign with name '" + request.getCampaignName() + "' already exists for this client.");
        }

        User client = userRepository.findById(request.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + request.getClientId()));
        User manager = userRepository.findById(request.getManagerId())
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found with id: " + request.getManagerId()));

        // DESIGN PATTERN: BUILDER PATTERN
        Campaign campaign = com.adflow.campaign.builder.CampaignBuilder.builder()
                .withName(request.getCampaignName())
                .forClient(client)
                .managedBy(manager)
                .withBudget(request.getBudget())
                .fromDate(request.getStartDate())
                .toDate(request.getEndDate())
                .withObjective(request.getObjective())
                .withCreativeBrief(request.getCreativeBrief())
                .withStatus(request.getStatus() != null ? request.getStatus() : CampaignStatus.UPCOMING)
                .build();

        Campaign saved = campaignRepository.save(campaign);
        return campaignMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public CampaignResponse updateCampaign(Integer id, CampaignRequest request) {
        Campaign campaign = campaignRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with id: " + id));

        if (!request.getEndDate().isAfter(request.getStartDate())) {
            throw new BadRequestException("Validation Error: End date must strictly be after start date.");
        }

        if (campaignRepository.existsByClient_UserIdAndCampaignNameIgnoreCaseAndCampaignIdNot(request.getClientId(), request.getCampaignName(), id)) {
            throw new ConflictException("Another campaign named '" + request.getCampaignName() + "' already exists for this client.");
        }

        User client = userRepository.findById(request.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + request.getClientId()));
        User manager = userRepository.findById(request.getManagerId())
                .orElseThrow(() -> new ResourceNotFoundException("Manager not found with id: " + request.getManagerId()));

        campaign.setCampaignName(request.getCampaignName());
        campaign.setClient(client);
        campaign.setManager(manager);
        campaign.setBudget(request.getBudget());
        campaign.setStartDate(request.getStartDate());
        campaign.setEndDate(request.getEndDate());
        campaign.setObjective(request.getObjective());
        campaign.setCreativeBrief(request.getCreativeBrief());
        if (request.getStatus() != null) campaign.setStatus(request.getStatus());

        return campaignMapper.toResponse(campaignRepository.save(campaign));
    }

    @Override
    @Transactional
    public void deleteCampaign(Integer id) {
        if (!campaignRepository.existsById(id)) {
            throw new ResourceNotFoundException("Campaign not found with id: " + id);
        }
        campaignRepository.deleteById(id);
    }
}
