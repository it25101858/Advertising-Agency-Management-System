package com.adflow.service;

import com.adflow.campaign.repository.CampaignRepository;
import com.adflow.exception.ResourceNotFoundException;
import com.adflow.task.dto.TaskRequest;
import com.adflow.task.mapper.TaskMapper;
import com.adflow.task.repository.TaskRepository;
import com.adflow.task.service.TaskServiceImpl;
import com.adflow.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;
    @Mock
    private CampaignRepository campaignRepository;
    @Mock
    private UserRepository userRepository;

    private TaskServiceImpl taskService;

    @BeforeEach
    void setUp() {
        taskService = new TaskServiceImpl(taskRepository, campaignRepository, userRepository, new TaskMapper());
    }

    @Test
    void testCreateTask_NonExistentCampaign_ThrowsResourceNotFoundException() {
        TaskRequest req = new TaskRequest();
        req.setCampaignId(999);
        req.setAssignedToId(5);
        req.setCreatedById(4);
        req.setTitle("New Task");
        req.setDeadline(LocalDate.now().plusDays(5));

        when(campaignRepository.findById(999)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> taskService.createTask(req));
    }
}
