package com.adflow.task.service;

import com.adflow.task.dto.TaskRequest;
import com.adflow.task.dto.TaskResponse;
import com.adflow.task.enums.TaskPriority;
import com.adflow.task.enums.TaskStatus;

import java.util.List;

public interface TaskService {
    List<TaskResponse> getTasks(Integer campaignId, Integer assignedToId, TaskStatus status, TaskPriority priority);
    TaskResponse getTaskById(Integer id);
    TaskResponse createTask(TaskRequest request);
    TaskResponse updateTask(Integer id, TaskRequest request);
    TaskResponse updateTaskStatus(Integer id, TaskStatus status);
    void deleteTask(Integer id);
}
