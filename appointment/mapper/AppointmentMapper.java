package com.adflow.appointment.mapper;

import com.adflow.appointment.dto.AppointmentResponse;
import com.adflow.appointment.entity.Appointment;
import org.springframework.stereotype.Component;

@Component
public class AppointmentMapper {

    public AppointmentResponse toResponse(Appointment entity) {
        if (entity == null) return null;
        AppointmentResponse res = new AppointmentResponse();
        res.setAppointmentId(entity.getAppointmentId());
        if (entity.getClient() != null) {
            res.setClientId(entity.getClient().getUserId());
            res.setClientName(entity.getClient().getFullName());
        }
        if (entity.getAssignedStaff() != null) {
            res.setAssignedStaffId(entity.getAssignedStaff().getUserId());
            res.setStaffName(entity.getAssignedStaff().getFullName());
        }
        if (entity.getCampaign() != null) {
            res.setCampaignId(entity.getCampaign().getCampaignId());
            res.setCampaignName(entity.getCampaign().getCampaignName());
        }
        res.setMeetingDate(entity.getMeetingDate());
        res.setMeetingTime(entity.getMeetingTime());
        res.setPurpose(entity.getPurpose());
        res.setMeetingType(entity.getMeetingType());
        res.setStatus(entity.getStatus());
        res.setNotes(entity.getNotes());
        return res;
    }
}
