package com.adflow.invoice.repository;

import com.adflow.invoice.entity.Invoice;
import com.adflow.invoice.enums.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {
    List<Invoice> findByStatus(InvoiceStatus status);
    List<Invoice> findByClient_UserId(Integer clientId);
    boolean existsByInvoiceNumber(String invoiceNumber);
}
