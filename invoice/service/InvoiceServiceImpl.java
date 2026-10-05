package com.adflow.invoice.service;

import com.adflow.campaign.entity.Campaign;
import com.adflow.campaign.repository.CampaignRepository;
import com.adflow.exception.ConflictException;
import com.adflow.exception.ResourceNotFoundException;
import com.adflow.invoice.dto.InvoiceItemRequest;
import com.adflow.invoice.dto.InvoiceRequest;
import com.adflow.invoice.dto.InvoiceResponse;
import com.adflow.invoice.entity.Invoice;
import com.adflow.invoice.entity.InvoiceItem;
import com.adflow.invoice.enums.InvoiceStatus;
import com.adflow.invoice.mapper.InvoiceMapper;
import com.adflow.invoice.repository.InvoiceRepository;
import com.adflow.user.entity.User;
import com.adflow.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final CampaignRepository campaignRepository;
    private final UserRepository userRepository;
    private final InvoiceMapper invoiceMapper;

    public InvoiceServiceImpl(InvoiceRepository invoiceRepository,
                              CampaignRepository campaignRepository,
                              UserRepository userRepository,
                              InvoiceMapper invoiceMapper) {
        this.invoiceRepository = invoiceRepository;
        this.campaignRepository = campaignRepository;
        this.userRepository = userRepository;
        this.invoiceMapper = invoiceMapper;
    }

    @Override
    public List<InvoiceResponse> getInvoices(InvoiceStatus status, Integer clientId) {
        List<Invoice> list = invoiceRepository.findAll();
        return list.stream()
                .filter(inv -> status == null || inv.getStatus() == status)
                .filter(inv -> clientId == null || (inv.getClient() != null && inv.getClient().getUserId().equals(clientId)))
                .map(invoiceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public InvoiceResponse getInvoiceById(Integer id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));
        return invoiceMapper.toResponse(invoice);
    }

    @Override
    @Transactional
    public InvoiceResponse createInvoice(InvoiceRequest request) {
        Campaign campaign = campaignRepository.findById(request.getCampaignId())
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with id: " + request.getCampaignId()));
        User client = userRepository.findById(request.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + request.getClientId()));

        String invoiceNumber = request.getInvoiceNumber();
        if (invoiceNumber == null || invoiceNumber.trim().isEmpty()) {
            invoiceNumber = "INV-" + LocalDate.now().getYear() + "-" + String.format("%04d", (int)(Math.random() * 9000 + 1000));
        }

        if (invoiceRepository.existsByInvoiceNumber(invoiceNumber)) {
            throw new ConflictException("Invoice number already exists: " + invoiceNumber);
        }

        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(invoiceNumber);
        invoice.setCampaign(campaign);
        invoice.setClient(client);
        invoice.setIssueDate(request.getIssueDate());
        invoice.setDueDate(request.getDueDate());
        invoice.setTaxRate(request.getTaxRate() != null ? request.getTaxRate() : new BigDecimal("8.00"));
        invoice.setStatus(request.getStatus() != null ? request.getStatus() : InvoiceStatus.DRAFT);

        BigDecimal subtotal = BigDecimal.ZERO;
        for (InvoiceItemRequest itemReq : request.getItems()) {
            InvoiceItem item = new InvoiceItem();
            item.setInvoice(invoice);
            item.setDescription(itemReq.getDescription());
            item.setQuantity(itemReq.getQuantity());
            item.setUnitPrice(itemReq.getUnitPrice());
            BigDecimal lineTotal = itemReq.getUnitPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            item.setLineTotal(lineTotal);
            subtotal = subtotal.add(lineTotal);
            invoice.getItems().add(item);
        }

        invoice.setSubtotal(subtotal);
        BigDecimal taxAmount = subtotal.multiply(invoice.getTaxRate()).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        invoice.setTaxAmount(taxAmount);
        invoice.setTotalAmount(subtotal.add(taxAmount));

        InvoiceResponse response = invoiceMapper.toResponse(invoiceRepository.save(invoice));

        // --- FIX: Invoice create kedin campaign.spent_amount sync karanna ---
        syncCampaignSpentAmount(campaign.getCampaignId());

        return response;
    }

    @Override
    @Transactional
    public InvoiceResponse updateInvoiceStatus(Integer id, InvoiceStatus status) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));

        invoice.setStatus(status);
        if (status == InvoiceStatus.PAID) {
            invoice.setPaidAmount(invoice.getTotalAmount());
        } else if (status == InvoiceStatus.VOID) {
            invoice.setPaidAmount(BigDecimal.ZERO);
        }

        InvoiceResponse response = invoiceMapper.toResponse(invoiceRepository.save(invoice));

        // --- FIX: Status change kedin campaign.spent_amount sync karanna ---
        if (invoice.getCampaign() != null) {
            syncCampaignSpentAmount(invoice.getCampaign().getCampaignId());
        }

        return response;
    }

    @Override
    @Transactional
    public void deleteInvoice(Integer id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));

        Integer campaignId = (invoice.getCampaign() != null) ? invoice.getCampaign().getCampaignId() : null;

        invoiceRepository.deleteById(id);

        // --- FIX: Invoice delete kedin campaign.spent_amount sync karanna ---
        if (campaignId != null) {
            syncCampaignSpentAmount(campaignId);
        }
    }

    /**
     * Campaign eke spent_amount recalculate karanna:
     * e campaign ekata thiyana PAID invoices vala total_amount sum karala update karanna.
     *
     * Call karanna: Invoice create, status change (PAID/VOID), delete vala pasvala.
     */
    private void syncCampaignSpentAmount(Integer campaignId) {
        Campaign campaign = campaignRepository.findById(campaignId).orElse(null);
        if (campaign == null) return;

        BigDecimal totalPaid = invoiceRepository.sumPaidAmountByCampaignId(campaignId);
        campaign.setSpentAmount(totalPaid != null ? totalPaid : BigDecimal.ZERO);
        campaignRepository.save(campaign);
    }
}
