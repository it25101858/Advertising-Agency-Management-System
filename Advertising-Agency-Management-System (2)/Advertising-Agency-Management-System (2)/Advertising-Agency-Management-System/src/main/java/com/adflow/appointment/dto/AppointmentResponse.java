package com.adflow.appointment.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class AppointmentResponse {
    private Integer appointmentId;
    private Integer clientId;
    private String clientName;
    private Integer assignedStaffId;
    private String staffName;
    private Integer campaignId;
    private String campaignName;
    private LocalDate meetingDate;
    private LocalTime meetingTime;
    private String purpose;
    private String meetingType;
    private String status;
    private String notes;

    public Integer getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Integer appointmentId) { this.appointmentId = appointmentId; }

    public Integer getClientId() { return clientId; }
    public void setClientId(Integer clientId) { this.clientId = clientId; }

    public String getClientName() { return clientName; }
    public void setClientName(String clientName) { this.clientName = clientName; }

    public Integer getAssignedStaffId() { return assignedStaffId; }
    public void setAssignedStaffId(Integer assignedStaffId) { this.assignedStaffId = assignedStaffId; }

    public String getStaffName() { return staffName; }
    public void setStaffName(String staffName) { this.staffName = staffName; }

    public Integer getCampaignId() { return campaignId; }
    public void setCampaignId(Integer campaignId) { this.campaignId = campaignId; }

    public String getCampaignName() { return campaignName; }
    public void setCampaignName(String campaignName) { this.campaignName = campaignName; }

    public LocalDate getMeetingDate() { return meetingDate; }
    public void setMeetingDate(LocalDate meetingDate) { this.meetingDate = meetingDate; }

    public LocalTime getMeetingTime() { return meetingTime; }
    public void setMeetingTime(LocalTime meetingTime) { this.meetingTime = meetingTime; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public String getMeetingType() { return meetingType; }
    public void setMeetingType(String meetingType) { this.meetingType = meetingType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    // Frontend compatibility aliases
    public Integer getId() { return appointmentId; }
    public String getClient() { return clientName; }
    public String getStaff() { return staffName; }
    public String getCampaign() { return campaignName; }
    public String getDate() { return meetingDate != null ? meetingDate.toString() : null; }
    public String getTime() { return meetingTime != null ? meetingTime.toString() : null; }
    public String getType() { return meetingType; }
}
