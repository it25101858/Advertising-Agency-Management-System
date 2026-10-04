package com.adflow.notification.service;

import com.adflow.notification.entity.Notification;
import com.adflow.notification.factory.NotificationFactory;
import com.adflow.notification.repository.NotificationRepository;
import com.adflow.user.entity.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationFactory notificationFactory;

    public NotificationService(NotificationRepository notificationRepository,
                               NotificationFactory notificationFactory) {
        this.notificationRepository = notificationRepository;
        this.notificationFactory = notificationFactory;
    }

    public List<Notification> getUserNotifications(Integer userId) {
        return notificationRepository.findByUser_UserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public Notification sendNotification(NotificationFactory.NotificationType type, User user, String reference) {
        Notification notif = notificationFactory.createNotification(type, user, reference);
        return notificationRepository.save(notif);
    }

    @Transactional
    public void markAllAsRead(Integer userId) {
        List<Notification> unread = notificationRepository.findByUser_UserIdAndIsReadFalse(userId);
        for (Notification n : unread) {
            n.setIsRead(true);
        }
        notificationRepository.saveAll(unread);
    }
}
