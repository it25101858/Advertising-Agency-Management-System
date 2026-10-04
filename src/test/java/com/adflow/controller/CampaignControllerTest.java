package com.adflow.controller;

import com.adflow.campaign.controller.CampaignController;
import com.adflow.campaign.dto.CampaignResponse;
import com.adflow.campaign.enums.CampaignStatus;
import com.adflow.campaign.service.CampaignService;
import com.adflow.security.CustomUserDetailsService;
import com.adflow.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CampaignController.class)
@AutoConfigureMockMvc(addFilters = false)
public class CampaignControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CampaignService campaignService;
    @MockBean
    private JwtService jwtService;
    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void testGetAllCampaigns_Returns200() throws Exception {
        CampaignResponse cr = new CampaignResponse();
        cr.setCampaignId(1);
        cr.setCampaignName("5G Launch");
        cr.setBudget(new BigDecimal("1000000.00"));
        cr.setStartDate(LocalDate.now());
        cr.setEndDate(LocalDate.now().plusMonths(2));
        cr.setStatus(CampaignStatus.ACTIVE);

        when(campaignService.getAllCampaigns(null, null, null)).thenReturn(Collections.singletonList(cr));

        mockMvc.perform(get("/api/campaigns")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].campaignName").value("5G Launch"));
    }
}
