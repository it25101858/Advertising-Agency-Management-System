package com.adflow.service;

import com.adflow.campaign.entity.Campaign;
import com.adflow.campaign.repository.CampaignRepository;
import com.adflow.invoice.dto.InvoiceItemRequest;
import com.adflow.invoice.dto.InvoiceRequest;
import com.adflow.invoice.dto.InvoiceResponse;
import com.adflow.invoice.entity.Invoice;
import com.adflow.invoice.mapper.InvoiceMapper;
import com.adflow.invoice.repository.InvoiceRepository;
import com.adflow.invoice.service.InvoiceServiceImpl;
import com.adflow.user.entity.User;
import com.adflow.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class InvoiceServiceTest {

    @Mock
    private InvoiceRepository invoiceRepository;
    @Mock
    private CampaignRepository campaignRepository;
    @Mock
    private UserRepository userRepository;

    private InvoiceServiceImpl invoiceService;

    @BeforeEach
    void setUp() {
        invoiceService = new InvoiceServiceImpl(invoiceRepository, campaignRepository, userRepository, new InvoiceMapper());
    }

    @Test
    void testCreateInvoice_CalculatesTaxAndTotalsCorrectly() {
        InvoiceRequest req = new InvoiceRequest();
        req.setCampaignId(1);
        req.setClientId(1);
        req.setIssueDate(LocalDate.now());
        req.setDueDate(LocalDate.now().plusDays(30));
        req.setTaxRate(new BigDecimal("8.00")); // 8%

        InvoiceItemRequest item = new InvoiceItemRequest();
        item.setDescription("Billboard Design");
        item.setQuantity(2);
        item.setUnitPrice(new BigDecimal("50000.00")); // Total subtotal = 100,000
        req.setItems(Collections.singletonList(item));

        when(campaignRepository.findById(1)).thenReturn(Optional.of(new Campaign()));
        when(userRepository.findById(1)).thenReturn(Optional.of(new User()));
        when(invoiceRepository.save(any(Invoice.class))).thenAnswer(invocation -> invocation.getArgument(0));

        InvoiceResponse response = invoiceService.createInvoice(req);

        assertNotNull(response);
        assertEquals(new BigDecimal("100000.00"), response.getSubtotal());
        assertEquals(new BigDecimal("8000.00"), response.getTaxAmount());
        assertEquals(new BigDecimal("108000.00"), response.getTotalAmount());
    }
}
