package com.invoicely;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class InvoicelyApplication {

	public static void main(String[] args) {
		SpringApplication.run(InvoicelyApplication.class, args);
	}

	/*
     Optional test data code — fully commented out
     @Bean
     CommandLineRunner init(UserRepository userRepository) {
         return args -> {
             User user = new User();
             user.setName("Test User");
             user.setEmail("test@example.com");
             user.setPassword("password123");

             userRepository.save(user);
         };
     }
    */

}
