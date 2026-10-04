package com.adflow.invoice.controller;

import com.adflow.common.ApiResponse;
import com.adflow.invoice.dto.InvoiceRequest;
import com.adflow.invoice.dto.InvoiceResponse;
import com.adflow.invoice.enums.InvoiceStatus;
import com.adflow.invoice.service.InvoiceService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    private final InvoiceService invoiceService;

    public InvoiceController(InvoiceService invoiceService) {
        this.invoiceService = invoiceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<InvoiceResponse>>> getInvoices(
            @RequestParam(required = false) InvoiceStatus status,
            @RequestParam(required = false) Integer clientId) {
        return ResponseEntity.ok(ApiResponse.ok(invoiceService.getInvoices(status, clientId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InvoiceResponse>> getInvoiceById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.ok(invoiceService.getInvoiceById(id)));
    }

    @PostMapping(consumes = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<InvoiceResponse>> createInvoice(@Valid @RequestBody InvoiceRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Invoice generated successfully", invoiceService.createInvoice(request)));
    }

    @PostMapping(consumes = org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> handleFormAction(@RequestParam Map<String, String> params) {
        String action = params.getOrDefault("action", "CREATE");

        if ("DELETE".equalsIgnoreCase(action)) {
            String idStr = params.get("invoiceId");
            if (idStr == null) idStr = params.get("id");
            if (idStr != null) {
                invoiceService.deleteInvoice(Integer.parseInt(idStr));
                return ResponseEntity.ok(ApiResponse.ok("Invoice deleted", null));
            }
        }

        if ("UPDATE_STATUS".equalsIgnoreCase(action)) {
            String idStr = params.get("invoiceId");
            if (idStr == null) idStr = params.get("id");
            if (idStr != null && params.get("status") != null) {
                InvoiceStatus status = InvoiceStatus.valueOf(params.get("status"));
                return ResponseEntity.ok(ApiResponse.ok("Invoice status updated", invoiceService.updateInvoiceStatus(Integer.parseInt(idStr), status)));
            }
        }

        InvoiceRequest req = new InvoiceRequest();
        req.setInvoiceNumber(params.getOrDefault("invoiceNumber", "INV-" + System.currentTimeMillis()));
        req.setCampaignId(params.get("campaignId") != null ? Integer.parseInt(params.get("campaignId")) : 1);
        req.setClientId(params.get("clientId") != null ? Integer.parseInt(params.get("clientId")) : 1);
        if (params.get("issueDate") != null) req.setIssueDate(java.time.LocalDate.parse(params.get("issueDate")));
        else req.setIssueDate(java.time.LocalDate.now());
        if (params.get("dueDate") != null) req.setDueDate(java.time.LocalDate.parse(params.get("dueDate")));
        else req.setDueDate(java.time.LocalDate.now().plusDays(30));
        if (params.get("taxRate") != null) req.setTaxRate(new java.math.BigDecimal(params.get("taxRate")));
        if (params.get("status") != null) req.setStatus(InvoiceStatus.valueOf(params.get("status")));

        // Optional single item from form
        if (params.get("itemDescription") != null) {
            com.adflow.invoice.dto.InvoiceItemRequest item = new com.adflow.invoice.dto.InvoiceItemRequest();
            item.setDescription(params.get("itemDescription"));
            item.setQuantity(params.get("quantity") != null ? Integer.parseInt(params.get("quantity")) : 1);
            item.setUnitPrice(params.get("unitPrice") != null ? new java.math.BigDecimal(params.get("unitPrice")) : java.math.BigDecimal.valueOf(100000));
            req.setItems(java.util.Collections.singletonList(item));
        }

        return ResponseEntity.ok(ApiResponse.ok("Invoice created", invoiceService.createInvoice(req)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<InvoiceResponse>> updateInvoiceStatus(
            @PathVariable Integer id, @RequestBody Map<String, String> body) {
        InvoiceStatus status = InvoiceStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(ApiResponse.ok("Invoice status updated", invoiceService.updateInvoiceStatus(id, status)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteInvoice(@PathVariable Integer id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.ok(ApiResponse.ok("Invoice deleted successfully", null));
    }
}
