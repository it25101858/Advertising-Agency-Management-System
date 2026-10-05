package com.adflow.appointment.repository;

import com.adflow.appointment.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

    List<Appointment> findByMeetingDate(LocalDate date);
    List<Appointment> findByClient_UserId(Integer clientId);
    List<Appointment> findByAssignedStaff_UserId(Integer staffId);

    @Query("SELECT COUNT(a) > 0 FROM Appointment a " +
           "WHERE a.meetingDate = :date AND a.meetingTime = :time " +
           "AND a.status IN ('SCHEDULED', 'RESCHEDULED') " +
           "AND (a.assignedStaff.userId = :staffId OR a.client.userId = :clientId) " +
           "AND (:excludeId IS NULL OR a.appointmentId != :excludeId)")
    boolean hasDoubleBooking(@Param("staffId") Integer staffId,
                             @Param("clientId") Integer clientId,
                             @Param("date") LocalDate date,
                             @Param("time") LocalTime time,
                             @Param("excludeId") Integer excludeId);
}
