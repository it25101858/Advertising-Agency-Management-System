package com.adflow.task.mapper;

import com.adflow.task.dto.TaskResponse;
import com.adflow.task.entity.Task;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public TaskResponse toResponse(Task task) {
        if (task == null) return null;
        TaskResponse res = new TaskResponse();
        res.setTaskId(task.getTaskId());
        if (task.getCampaign() != null) {
            res.setCampaignId(task.getCampaign().getCampaignId());
            res.setCampaignName(task.getCampaign().getCampaignName());
        }
        if (task.getAssignedTo() != null) {
            res.setAssignedToId(task.getAssignedTo().getUserId());
            res.setAssignedToName(task.getAssignedTo().getFullName());
        }
        if (task.getCreatedBy() != null) {
            res.setCreatedById(task.getCreatedBy().getUserId());
            res.setCreatedByName(task.getCreatedBy().getFullName());
        }
        res.setTitle(task.getTitle());
        res.setDescription(task.getDescription());
        res.setPriority(task.getPriority());
        res.setStatus(task.getStatus());
        res.setDeadline(task.getDeadline());
        res.setCreatedAt(task.getCreatedAt());
        return res;
    }
}
