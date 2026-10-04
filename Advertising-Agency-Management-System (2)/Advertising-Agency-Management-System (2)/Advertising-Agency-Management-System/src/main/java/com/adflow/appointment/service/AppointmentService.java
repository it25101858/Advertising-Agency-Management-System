package com.adflow.appointment.service;

import com.adflow.appointment.dto.AppointmentRequest;
import com.adflow.appointment.dto.AppointmentResponse;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentService {
    List<AppointmentResponse> getAppointments(LocalDate date, Integer clientId, Integer staffId);
    AppointmentResponse getAppointmentById(Integer id);
    AppointmentResponse bookAppointment(AppointmentRequest request);
    AppointmentResponse updateAppointment(Integer id, AppointmentRequest request);
    void deleteAppointment(Integer id);
}
