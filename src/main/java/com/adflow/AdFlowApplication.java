package com.adflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * ============================================================================
 * AdFlow - Enterprise Advertising Agency Management System
 * Spring Boot 3 Main Application Launcher
 * Group: Y2-S1-MLB-B4G1-03 | BrightWave Advertising (Pvt) Ltd
 * ============================================================================
 */
@SpringBootApplication
public class AdFlowApplication {

    public static void main(String[] args) {
        SpringApplication.run(AdFlowApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  AdFlow Enterprise Spring Boot Platform Started ");
        System.out.println("  Web Portal: http://localhost:8080/");
        System.out.println("  REST API:   http://localhost:8080/api/");
        System.out.println("=================================================");
    }
}
