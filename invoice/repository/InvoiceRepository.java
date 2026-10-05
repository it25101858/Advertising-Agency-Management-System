package com.adflow.invoice.repository;

import com.adflow.invoice.entity.Invoice;
import com.adflow.invoice.enums.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {
    List<Invoice> findByStatus(InvoiceStatus status);
    List<Invoice> findByClient_UserId(Integer clientId);
    boolean existsByInvoiceNumber(String invoiceNumber);

    // Sum total_amount of all PAID invoices for a campaign (to sync campaign.spent_amount)
    @Query("SELECT COALESCE(SUM(i.totalAmount), 0) FROM Invoice i WHERE i.campaign.campaignId = :campaignId AND i.status = 'PAID'")
    BigDecimal sumPaidAmountByCampaignId(@Param("campaignId") Integer campaignId);

    List<Invoice> findByCampaign_CampaignId(Integer campaignId);
}
