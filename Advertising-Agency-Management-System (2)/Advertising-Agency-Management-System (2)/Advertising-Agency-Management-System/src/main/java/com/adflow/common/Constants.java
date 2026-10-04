package com.adflow.common;

/**
 * ============================================================================
 * AdFlow - System Constants & Business Rules Configuration
 * ============================================================================
 */
public final class Constants {

    private Constants() {
        // Prevent instantiation
    }

    // Role Names
    public static final String ROLE_SYSTEM_ADMIN = "SYSTEM_ADMIN";
    public static final String ROLE_MANAGING_DIRECTOR = "MANAGING_DIRECTOR";
    public static final String ROLE_CLIENT_RELATIONS_OFFICER = "CLIENT_RELATIONS_OFFICER";
    public static final String ROLE_MARKETING_MANAGER = "MARKETING_MANAGER";
    public static final String ROLE_CREATIVE_TEAM_LEAD = "CREATIVE_TEAM_LEAD";
    public static final String ROLE_CREATIVE_STAFF = "CREATIVE_STAFF";
    public static final String ROLE_FINANCE_EXECUTIVE = "FINANCE_EXECUTIVE";
    public static final String ROLE_CLIENT = "CLIENT";

    // Business Constraints
    public static final double DEFAULT_TAX_RATE = 8.00; // 8% VAT
    public static final int WORKING_HOURS_START = 8;     // 08:00 AM
    public static final int WORKING_HOURS_END = 17;      // 05:00 PM
    public static final int MIN_CAMPAIGN_NAME_LENGTH = 3;
    public static final int MAX_CAMPAIGN_NAME_LENGTH = 100;
}
