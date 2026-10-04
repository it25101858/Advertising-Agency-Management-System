package com.adflow.invoice.service;

import com.adflow.invoice.dto.InvoiceRequest;
import com.adflow.invoice.dto.InvoiceResponse;
import com.adflow.invoice.enums.InvoiceStatus;

import java.util.List;

public interface InvoiceService {
    List<InvoiceResponse> getInvoices(InvoiceStatus status, Integer clientId);
    InvoiceResponse getInvoiceById(Integer id);
    InvoiceResponse createInvoice(InvoiceRequest request);
    InvoiceResponse updateInvoiceStatus(Integer id, InvoiceStatus status);
    void deleteInvoice(Integer id);
}
