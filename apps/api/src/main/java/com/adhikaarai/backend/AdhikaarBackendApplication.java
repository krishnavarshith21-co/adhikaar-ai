package com.adhikaarai.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(exclude = org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration.class)
public class AdhikaarBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(AdhikaarBackendApplication.class, args);
    }
}
