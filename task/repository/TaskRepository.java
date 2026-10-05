package com.adflow.task.repository;

import com.adflow.task.entity.Task;
import com.adflow.task.enums.TaskPriority;
import com.adflow.task.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByPriority(TaskPriority priority);
    List<Task> findByCampaign_CampaignId(Integer campaignId);
    List<Task> findByAssignedTo_UserId(Integer userId);
}
