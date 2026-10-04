package com.adflow.service;

import com.adflow.campaign.dto.CampaignRequest;
import com.adflow.campaign.mapper.CampaignMapper;
import com.adflow.campaign.repository.CampaignRepository;
import com.adflow.campaign.service.CampaignServiceImpl;
import com.adflow.exception.BadRequestException;
import com.adflow.exception.ConflictException;
import com.adflow.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CampaignServiceTest {

    @Mock
    private CampaignRepository campaignRepository;
    @Mock
    private UserRepository userRepository;

    private CampaignServiceImpl campaignService;

    @BeforeEach
    void setUp() {
        campaignService = new CampaignServiceImpl(campaignRepository, userRepository, new CampaignMapper());
    }

    @Test
    void testCreateCampaign_InvalidDateOrder_ThrowsBadRequestException() {
        CampaignRequest req = new CampaignRequest();
        req.setCampaignName("Test Campaign");
        req.setClientId(1);
        req.setManagerId(3);
        req.setBudget(new BigDecimal("100000.00"));
        req.setStartDate(LocalDate.now().plusDays(10));
        req.setEndDate(LocalDate.now().plusDays(5)); // End before start

        assertThrows(BadRequestException.class, () -> campaignService.createCampaign(req));
    }

    @Test
    void testCreateCampaign_DuplicateName_ThrowsConflictException() {
        CampaignRequest req = new CampaignRequest();
        req.setCampaignName("Existing Campaign");
        req.setClientId(1);
        req.setManagerId(3);
        req.setBudget(new BigDecimal("100000.00"));
        req.setStartDate(LocalDate.now().plusDays(1));
        req.setEndDate(LocalDate.now().plusDays(10));

        when(campaignRepository.existsByClient_UserIdAndCampaignNameIgnoreCase(any(), any())).thenReturn(true);

        assertThrows(ConflictException.class, () -> campaignService.createCampaign(req));
    }
}
