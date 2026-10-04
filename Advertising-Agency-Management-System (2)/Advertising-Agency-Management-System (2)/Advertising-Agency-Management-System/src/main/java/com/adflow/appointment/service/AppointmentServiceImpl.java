package com.adflow.appointment.service;

import com.adflow.appointment.dto.AppointmentRequest;
import com.adflow.appointment.dto.AppointmentResponse;
import com.adflow.appointment.entity.Appointment;
import com.adflow.appointment.mapper.AppointmentMapper;
import com.adflow.appointment.repository.AppointmentRepository;
import com.adflow.campaign.entity.Campaign;
import com.adflow.campaign.repository.CampaignRepository;
import com.adflow.exception.BadRequestException;
import com.adflow.exception.ConflictException;
import com.adflow.exception.ResourceNotFoundException;
import com.adflow.user.entity.User;
import com.adflow.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final CampaignRepository campaignRepository;
    private final AppointmentMapper appointmentMapper;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository,
                                  UserRepository userRepository,
                                  CampaignRepository campaignRepository,
                                  AppointmentMapper appointmentMapper) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.campaignRepository = campaignRepository;
        this.appointmentMapper = appointmentMapper;
    }

    @Override
    public List<AppointmentResponse> getAppointments(LocalDate date, Integer clientId, Integer staffId) {
        if (date != null) {
            return appointmentRepository.findByMeetingDate(date).stream().map(appointmentMapper::toResponse).collect(Collectors.toList());
        }
        if (clientId != null) {
            return appointmentRepository.findByClient_UserId(clientId).stream().map(appointmentMapper::toResponse).collect(Collectors.toList());
        }
        if (staffId != null) {
            return appointmentRepository.findByAssignedStaff_UserId(staffId).stream().map(appointmentMapper::toResponse).collect(Collectors.toList());
        }
        return appointmentRepository.findAll().stream().map(appointmentMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public AppointmentResponse getAppointmentById(Integer id) {
        Appointment app = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        return appointmentMapper.toResponse(app);
    }

    @Override
    @Transactional
    public AppointmentResponse bookAppointment(AppointmentRequest request) {
        validateBusinessRules(request, null);

        // Safely resolve client — fallback to user_id=1 (default seed client) if not found
        User client = null;
        if (request.getClientId() != null) {
            client = userRepository.findById(request.getClientId()).orElse(null);
        }
        if (client == null) {
            client = userRepository.findAll().stream()
                    .filter(u -> "CLIENT".equals(u.getRole() != null ? u.getRole().name() : ""))
                    .findFirst()
                    .orElse(userRepository.findAll().stream().findFirst()
                            .orElseThrow(() -> new ResourceNotFoundException("No users found in database. Please run the database schema/seed script.")));
        }

        // Safely resolve staff — fallback to user_id=2 (CRO) if not found
        User staff = null;
        if (request.getAssignedStaffId() != null) {
            staff = userRepository.findById(request.getAssignedStaffId()).orElse(null);
        }
        if (staff == null) {
            staff = userRepository.findAll().stream()
                    .filter(u -> u.getRole() != null && !"CLIENT".equals(u.getRole().name()))
                    .findFirst()
                    .orElse(client);
        }

        Campaign campaign = null;
        if (request.getCampaignId() != null) {
            campaign = campaignRepository.findById(request.getCampaignId()).orElse(null);
        }

        Appointment app = new Appointment();
        app.setClient(client);
        app.setAssignedStaff(staff);
        app.setCampaign(campaign);
        app.setMeetingDate(request.getMeetingDate());
        app.setMeetingTime(request.getMeetingTime());
        app.setPurpose(request.getPurpose());
        app.setMeetingType(request.getMeetingType() != null ? request.getMeetingType() : "VIRTUAL_CALL");
        app.setStatus(request.getStatus() != null ? request.getStatus() : "SCHEDULED");
        app.setNotes(request.getNotes());

        return appointmentMapper.toResponse(appointmentRepository.save(app));
    }

    @Override
    @Transactional
    public AppointmentResponse updateAppointment(Integer id, AppointmentRequest request) {
        Appointment app = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));

        validateBusinessRules(request, id);

        // Safely resolve client — keep existing if not provided
        User client = app.getClient();
        if (request.getClientId() != null) {
            client = userRepository.findById(request.getClientId()).orElse(app.getClient());
        }

        // Safely resolve staff — keep existing if not provided
        User staff = app.getAssignedStaff();
        if (request.getAssignedStaffId() != null) {
            staff = userRepository.findById(request.getAssignedStaffId()).orElse(app.getAssignedStaff());
        }

        Campaign campaign = app.getCampaign();
        if (request.getCampaignId() != null) {
            campaign = campaignRepository.findById(request.getCampaignId()).orElse(app.getCampaign());
        }

        app.setClient(client);
        app.setAssignedStaff(staff);
        app.setCampaign(campaign);
        if (request.getMeetingDate() != null) app.setMeetingDate(request.getMeetingDate());
        if (request.getMeetingTime() != null) app.setMeetingTime(request.getMeetingTime());
        if (request.getPurpose() != null && !request.getPurpose().isBlank()) app.setPurpose(request.getPurpose());
        if (request.getMeetingType() != null) app.setMeetingType(request.getMeetingType());
        if (request.getStatus() != null) app.setStatus(request.getStatus());
        if (request.getNotes() != null) app.setNotes(request.getNotes());

        return appointmentMapper.toResponse(appointmentRepository.save(app));
    }

    @Override
    @Transactional
    public void deleteAppointment(Integer id) {
        if (!appointmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Appointment not found with id: " + id);
        }
        appointmentRepository.deleteById(id);
    }

    private void validateBusinessRules(AppointmentRequest req, Integer excludeId) {
        // Rule 1: Future date
        if (req.getMeetingDate() == null || req.getMeetingTime() == null) return;
        LocalDate today = LocalDate.now();
        if (req.getMeetingDate().isBefore(today)) {
            throw new BadRequestException("Validation Error: Cannot book appointment for a past date (" + req.getMeetingDate() + ").");
        }
        if (req.getMeetingDate().isEqual(today) && req.getMeetingTime().isBefore(LocalTime.now())) {
            throw new BadRequestException("Validation Error: Cannot book appointment for a past time today.");
        }

        // Rule 2: Business working hours (08:00 - 17:00)
        LocalTime workStart = LocalTime.of(8, 0);
        LocalTime workEnd = LocalTime.of(17, 0);
        if (req.getMeetingTime().isBefore(workStart) || req.getMeetingTime().isAfter(workEnd)) {
            throw new BadRequestException("Validation Error: Appointment must be within working hours (08:00 AM - 05:00 PM).");
        }

        // Rule 3: Double booking guard (only when both IDs are available)
        if (req.getAssignedStaffId() != null && req.getClientId() != null) {
            boolean isDoubleBooked = appointmentRepository.hasDoubleBooking(
                    req.getAssignedStaffId(),
                    req.getClientId(),
                    req.getMeetingDate(),
                    req.getMeetingTime(),
                    excludeId
            );
            if (isDoubleBooked) {
                throw new ConflictException("Double-Booking Conflict: The staff member or client already has an active appointment at this date and time.");
            }
        }
    }
}
