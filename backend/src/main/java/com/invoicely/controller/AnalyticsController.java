package com.invoicely.controller;

import com.invoicely.repository.InvoiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsController {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardAnalytics() {
        Map<String, Object> analytics = new HashMap<>();

        // Total metrics
        long totalInvoices = invoiceRepository.count();
        Double totalRevenue = invoiceRepository.sumTotalByStatus("Paid");
        Double outstandingAmount = invoiceRepository.sumTotalByStatus("Unpaid");

        analytics.put("totalInvoices", totalInvoices);
        analytics.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);
        analytics.put("outstandingAmount", outstandingAmount != null ? outstandingAmount : 0.0);

        // Status distribution
        long paidCount = invoiceRepository.countByStatus("Paid");
        long unpaidCount = invoiceRepository.countByStatus("Unpaid");

        Map<String, Long> statusDistribution = new HashMap<>();
        statusDistribution.put("Paid", paidCount);
        statusDistribution.put("Unpaid", unpaidCount);
        analytics.put("statusDistribution", statusDistribution);

        // Monthly revenue
        List<Object[]> monthlyRevenue = invoiceRepository.getMonthlyRevenue();
        analytics.put("monthlyRevenue", monthlyRevenue);

        return analytics;
    }
}
