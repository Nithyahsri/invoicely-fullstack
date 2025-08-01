package com.invoicely.service;

import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.invoicely.model.Invoice;
import com.invoicely.model.InvoiceItem;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.SimpleDateFormat;

@Service
public class PdfGeneratorService {

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");

    public void generateInvoice(Invoice invoice, HttpServletResponse response) throws IOException {
        response.setContentType("application/pdf");

        String safeClientName = invoice.getClientName() != null
                ? invoice.getClientName().trim().replaceAll("[^a-zA-Z0-9]", "_")
                : "invoice";

        String fileName = safeClientName + ".pdf";

        System.out.println("Setting PDF filename to: " + fileName);  // DEBUG print

        response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");

        PdfWriter writer = new PdfWriter(response.getOutputStream());
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);

        document.add(new Paragraph("INVOICE #" + invoice.getId()));
        document.add(new Paragraph("Client: " + invoice.getClientName()));
        if (invoice.getIssueDate() != null)
            document.add(new Paragraph("Issue Date: " + dateFormat.format(invoice.getIssueDate())));
        if (invoice.getDueDate() != null)
            document.add(new Paragraph("Due Date: " + dateFormat.format(invoice.getDueDate())));
        document.add(new Paragraph("Status: " + invoice.getStatus()));
        document.add(new Paragraph("Total: $" + String.format("%.2f", invoice.getTotal())));

        document.add(new Paragraph("\nItems:\n"));
        if (invoice.getItems() != null && !invoice.getItems().isEmpty()) {
            for (InvoiceItem item : invoice.getItems()) {
                String line = String.format("%s | Qty: %d | Price: $%.2f | Tax: %.2f%% | Subtotal: $%.2f",
                        item.getDescription() != null ? item.getDescription() : "",
                        item.getQuantity(),
                        item.getPrice(),
                        item.getTax(),
                        item.getPrice() * item.getQuantity() * (1 + item.getTax() / 100));
                document.add(new Paragraph(line));
            }
        } else {
            document.add(new Paragraph("No items."));
        }

        document.close();
    }
}
