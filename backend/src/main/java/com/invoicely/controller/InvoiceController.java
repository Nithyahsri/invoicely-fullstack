package com.invoicely.controller;

import com.invoicely.model.Invoice;
import com.invoicely.repository.InvoiceRepository;
import com.invoicely.service.PdfGeneratorService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "http://localhost:3000")  // Adjust origin as per your frontend URL
public class InvoiceController {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private PdfGeneratorService pdfGeneratorService;

    // Get all invoices
    @GetMapping
    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    // Get invoice by ID
    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoice(@PathVariable Long id) {
        return invoiceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new invoice
    @PostMapping
    public Invoice createInvoice(@RequestBody Invoice invoice) {
        if (invoice.getItems() != null) {
            invoice.getItems().forEach(item -> item.setInvoice(invoice));
        }
        return invoiceRepository.save(invoice);
    }

    // Update invoice
    @PutMapping("/{id}")
    public ResponseEntity<Invoice> updateInvoice(@PathVariable Long id, @RequestBody Invoice updatedInvoice) {
        return invoiceRepository.findById(id).map(invoice -> {
            invoice.setClientName(updatedInvoice.getClientName());
            invoice.setIssueDate(updatedInvoice.getIssueDate());
            invoice.setDueDate(updatedInvoice.getDueDate());
            invoice.setStatus(updatedInvoice.getStatus());
            invoice.setTotal(updatedInvoice.getTotal());

            invoice.getItems().clear();
            if (updatedInvoice.getItems() != null) {
                updatedInvoice.getItems().forEach(item -> item.setInvoice(invoice));
                invoice.getItems().addAll(updatedInvoice.getItems());
            }
            return ResponseEntity.ok(invoiceRepository.save(invoice));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Delete invoice
    @DeleteMapping("/{id}")
    public void deleteInvoice(@PathVariable Long id) {
        invoiceRepository.deleteById(id);
    }

    // Download PDF for a specific invoice by ID
    @GetMapping("/{id}/download")
    public void downloadInvoiceById(@PathVariable Long id, HttpServletResponse response) throws IOException {
        invoiceRepository.findById(id).ifPresentOrElse(invoice -> {
            try {
                pdfGeneratorService.generateInvoice(invoice, response);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        }, () -> response.setStatus(HttpServletResponse.SC_NOT_FOUND));
    }
}
