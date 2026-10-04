package com.adflow.notification.factory;

import com.adflow.notification.entity.Notification;
import com.adflow.user.entity.User;
import org.springframework.stereotype.Component;

/**
 * ============================================================================
 * DESIGN PATTERN IMPLEMENTATION: FACTORY METHOD PATTERN
 * ============================================================================
 * Evaluated in Phase 3 Viva (SE2030 Requirement: Min 2 Design Patterns)
 */
@Component
public class NotificationFactory {

    public enum NotificationType {
        APPOINTMENT_REMINDER,
        TASK_ASSIGNMENT,
        FEEDBACK_SUBMITTED,
        INVOICE_GENERATED,
        ASSET_UPLOADED
    }

    public Notification createNotification(NotificationType type, User user, String referenceName) {
        switch (type) {
            case APPOINTMENT_REMINDER:
                return new Notification(
                        user,
                        "Appointment Scheduled",
                        "You have an upcoming consultation regarding: " + referenceName,
                        "APPOINTMENT"
                );
            case TASK_ASSIGNMENT:
                return new Notification(
                        user,
                        "New Task Assigned",
                        "You have been assigned to task: " + referenceName,
                        "TASK"
                );
            case FEEDBACK_SUBMITTED:
                return new Notification(
                        user,
                        "Client Feedback Submitted",
                        "New client review received for campaign: " + referenceName,
                        "FEEDBACK"
                );
            case INVOICE_GENERATED:
                return new Notification(
                        user,
                        "New Invoice Ready",
                        "Invoice generated for billing: " + referenceName,
                        "INVOICE"
                );
            case ASSET_UPLOADED:
                return new Notification(
                        user,
                        "Asset Uploaded",
                        "New media asset uploaded to library: " + referenceName,
                        "ASSET"
                );
            default:
                throw new IllegalArgumentException("Unknown notification type: " + type);
        }
    }
}
