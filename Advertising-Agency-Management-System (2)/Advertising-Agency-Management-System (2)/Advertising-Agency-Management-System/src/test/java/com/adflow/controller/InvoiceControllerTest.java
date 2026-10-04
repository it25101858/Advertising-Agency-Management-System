package com.adflow.controller;

import com.adflow.invoice.controller.InvoiceController;
import com.adflow.invoice.dto.InvoiceResponse;
import com.adflow.invoice.enums.InvoiceStatus;
import com.adflow.invoice.service.InvoiceService;
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

@WebMvcTest(InvoiceController.class)
@AutoConfigureMockMvc(addFilters = false)
public class InvoiceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private InvoiceService invoiceService;
    @MockBean
    private JwtService jwtService;
    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void testGetInvoices_Returns200() throws Exception {
        InvoiceResponse inv = new InvoiceResponse();
        inv.setInvoiceId(1);
        inv.setInvoiceNumber("INV-2026-001");
        inv.setTotalAmount(new BigDecimal("108000.00"));
        inv.setIssueDate(LocalDate.now());
        inv.setDueDate(LocalDate.now().plusDays(30));
        inv.setStatus(InvoiceStatus.PAID);

        when(invoiceService.getInvoices(null, null)).thenReturn(Collections.singletonList(inv));

        mockMvc.perform(get("/api/invoices")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].invoiceNumber").value("INV-2026-001"));
    }
}
