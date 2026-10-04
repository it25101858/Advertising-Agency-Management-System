package com.adflow.invoice.mapper;

import com.adflow.invoice.dto.InvoiceResponse;
import com.adflow.invoice.entity.Invoice;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class InvoiceMapper {

    public InvoiceResponse toResponse(Invoice invoice) {
        if (invoice == null) return null;
        InvoiceResponse res = new InvoiceResponse();
        res.setInvoiceId(invoice.getInvoiceId());
        res.setInvoiceNumber(invoice.getInvoiceNumber());
        if (invoice.getCampaign() != null) {
            res.setCampaignId(invoice.getCampaign().getCampaignId());
            res.setCampaignName(invoice.getCampaign().getCampaignName());
        }
        if (invoice.getClient() != null) {
            res.setClientId(invoice.getClient().getUserId());
            res.setClientName(invoice.getClient().getFullName());
        }
        res.setIssueDate(invoice.getIssueDate());
        res.setDueDate(invoice.getDueDate());
        res.setTaxRate(invoice.getTaxRate());
        res.setSubtotal(invoice.getSubtotal());
        res.setTaxAmount(invoice.getTaxAmount());
        res.setTotalAmount(invoice.getTotalAmount());
        res.setPaidAmount(invoice.getPaidAmount());
        res.setStatus(invoice.getStatus());

        if (invoice.getItems() != null) {
            res.setItems(invoice.getItems().stream().map(item -> {
                InvoiceResponse.ItemResponse ir = new InvoiceResponse.ItemResponse();
                ir.setItemId(item.getItemId());
                ir.setDescription(item.getDescription());
                ir.setQuantity(item.getQuantity());
                ir.setUnitPrice(item.getUnitPrice());
                ir.setLineTotal(item.getLineTotal());
                return ir;
            }).collect(Collectors.toList()));
        }
        return res;
    }
}
