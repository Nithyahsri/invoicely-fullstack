package com.invoicely.repository;

import com.invoicely.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    // Analytics methods
    long countByStatus(String status);

    @Query("SELECT SUM(i.total) FROM Invoice i WHERE i.status = :status")
    Double sumTotalByStatus(@Param("status") String status);

    @Query("SELECT MONTH(i.issueDate) as month, SUM(i.total) as revenue FROM Invoice i WHERE i.status = 'Paid' GROUP BY MONTH(i.issueDate) ORDER BY month")
    List<Object[]> getMonthlyRevenue();
}
