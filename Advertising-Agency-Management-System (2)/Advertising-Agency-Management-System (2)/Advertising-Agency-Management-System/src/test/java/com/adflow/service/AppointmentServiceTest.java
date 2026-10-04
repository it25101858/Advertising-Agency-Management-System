package com.adflow.service;

import com.adflow.appointment.dto.AppointmentRequest;
import com.adflow.appointment.mapper.AppointmentMapper;
import com.adflow.appointment.repository.AppointmentRepository;
import com.adflow.appointment.service.AppointmentServiceImpl;
import com.adflow.campaign.repository.CampaignRepository;
import com.adflow.exception.BadRequestException;
import com.adflow.exception.ConflictException;
import com.adflow.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private CampaignRepository campaignRepository;

    private AppointmentServiceImpl appointmentService;

    @BeforeEach
    void setUp() {
        appointmentService = new AppointmentServiceImpl(appointmentRepository, userRepository, campaignRepository, new AppointmentMapper());
    }

    @Test
    void testBookAppointment_PastDate_ThrowsBadRequestException() {
        AppointmentRequest req = new AppointmentRequest();
        req.setMeetingDate(LocalDate.now().minusDays(1));
        req.setMeetingTime(LocalTime.of(10, 0));
        req.setClientId(1);
        req.setAssignedStaffId(2);
        req.setPurpose("Strategy Session");

        assertThrows(BadRequestException.class, () -> appointmentService.bookAppointment(req));
    }

    @Test
    void testBookAppointment_OutsideWorkingHours_ThrowsBadRequestException() {
        AppointmentRequest req = new AppointmentRequest();
        req.setMeetingDate(LocalDate.now().plusDays(2));
        req.setMeetingTime(LocalTime.of(19, 0)); // 7:00 PM outside 8-5
        req.setClientId(1);
        req.setAssignedStaffId(2);
        req.setPurpose("Strategy Session");

        assertThrows(BadRequestException.class, () -> appointmentService.bookAppointment(req));
    }

    @Test
    void testBookAppointment_DoubleBooking_ThrowsConflictException() {
        AppointmentRequest req = new AppointmentRequest();
        req.setMeetingDate(LocalDate.now().plusDays(2));
        req.setMeetingTime(LocalTime.of(10, 0));
        req.setClientId(1);
        req.setAssignedStaffId(2);
        req.setPurpose("Strategy Session");

        when(appointmentRepository.hasDoubleBooking(any(), any(), any(), any(), any())).thenReturn(true);

        assertThrows(ConflictException.class, () -> appointmentService.bookAppointment(req));
    }
}
