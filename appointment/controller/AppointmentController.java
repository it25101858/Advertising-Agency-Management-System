package com.adflow.appointment.controller;

import com.adflow.appointment.dto.AppointmentRequest;
import com.adflow.appointment.dto.AppointmentResponse;
import com.adflow.appointment.service.AppointmentService;
import com.adflow.common.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/appointments", "/appointments_api"})
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getAppointments(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) Integer clientId,
            @RequestParam(required = false) Integer staffId) {
        return ResponseEntity.ok(ApiResponse.ok(appointmentService.getAppointments(date, clientId, staffId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AppointmentResponse>> getAppointmentById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.ok(appointmentService.getAppointmentById(id)));
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<AppointmentResponse>> bookAppointment(@Valid @RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Appointment scheduled successfully", appointmentService.bookAppointment(request)));
    }

    @PostMapping(consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> handleFormAction(@RequestParam Map<String, String> params) {
        String action = params.getOrDefault("action", "CREATE");

        if ("DELETE".equalsIgnoreCase(action)) {
            String idStr = params.get("appointmentId");
            if (idStr == null) idStr = params.get("id");
            if (idStr != null) {
                appointmentService.deleteAppointment(Integer.parseInt(idStr));
                return ResponseEntity.ok(ApiResponse.ok("Appointment deleted", null));
            }
        }

        AppointmentRequest req = new AppointmentRequest();
        req.setClientId(params.get("clientId") != null ? Integer.parseInt(params.get("clientId")) : 1);
        req.setAssignedStaffId(params.get("staffId") != null ? Integer.parseInt(params.get("staffId")) : 2);
        if (params.get("campaignId") != null && !params.get("campaignId").isEmpty()) {
            req.setCampaignId(Integer.parseInt(params.get("campaignId")));
        }
        if (params.get("meetingDate") != null) req.setMeetingDate(LocalDate.parse(params.get("meetingDate")));
        if (params.get("meetingTime") != null) req.setMeetingTime(LocalTime.parse(params.get("meetingTime").substring(0, 5)));
        req.setPurpose(params.get("purpose"));
        req.setMeetingType(params.getOrDefault("meetingType", "VIRTUAL_CALL"));
        req.setStatus(params.getOrDefault("status", "SCHEDULED"));
        req.setNotes(params.get("notes"));

        if ("UPDATE".equalsIgnoreCase(action)) {
            String idStr = params.get("appointmentId");
            if (idStr == null) idStr = params.get("id");
            Integer id = Integer.parseInt(idStr);
            return ResponseEntity.ok(ApiResponse.ok("Appointment updated", appointmentService.updateAppointment(id, req)));
        }

        return ResponseEntity.ok(ApiResponse.ok("Appointment booked", appointmentService.bookAppointment(req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AppointmentResponse>> updateAppointment(@PathVariable Integer id, @Valid @RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Appointment updated successfully", appointmentService.updateAppointment(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAppointment(@PathVariable Integer id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok(ApiResponse.ok("Appointment deleted successfully", null));
    }
}
