package com.invoicely.repository;

import com.invoicely.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    // Additional query methods can be added if needed
}
