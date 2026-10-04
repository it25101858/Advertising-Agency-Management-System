package com.adflow.task.controller;

import com.adflow.common.ApiResponse;
import com.adflow.task.dto.TaskRequest;
import com.adflow.task.dto.TaskResponse;
import com.adflow.task.enums.TaskPriority;
import com.adflow.task.enums.TaskStatus;
import com.adflow.task.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getTasks(
            @RequestParam(required = false) Integer campaignId,
            @RequestParam(required = false) Integer assignedToId,
            @RequestParam(required = false) TaskStatus status,
            @RequestParam(required = false) TaskPriority priority) {
        return ResponseEntity.ok(ApiResponse.ok(taskService.getTasks(campaignId, assignedToId, status, priority)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTaskById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.ok(taskService.getTaskById(id)));
    }

    @PostMapping(consumes = org.springframework.http.MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ApiResponse<TaskResponse>> createTask(@Valid @RequestBody TaskRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Task created successfully", taskService.createTask(request)));
    }

    @PostMapping(consumes = org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<?> handleFormAction(@RequestParam Map<String, String> params) {
        String action = params.getOrDefault("action", "CREATE");

        if ("DELETE".equalsIgnoreCase(action)) {
            String idStr = params.get("taskId");
            if (idStr == null) idStr = params.get("id");
            if (idStr != null) {
                taskService.deleteTask(Integer.parseInt(idStr));
                return ResponseEntity.ok(ApiResponse.ok("Task deleted", null));
            }
        }

        TaskRequest req = new TaskRequest();
        String title = params.get("title") != null ? params.get("title") : params.get("taskTitle");
        String desc = params.get("description") != null ? params.get("description") : params.get("desc");
        req.setTitle(title != null ? title : "Creative Task");
        req.setDescription(desc != null ? desc : "");
        if (params.get("campaignId") != null && !params.get("campaignId").isEmpty()) {
            req.setCampaignId(Integer.parseInt(params.get("campaignId")));
        } else {
            req.setCampaignId(1);
        }
        if (params.get("assignedToId") != null && !params.get("assignedToId").isEmpty()) {
            req.setAssignedToId(Integer.parseInt(params.get("assignedToId")));
        } else if (params.get("assignedTo") != null && !params.get("assignedTo").isEmpty()) {
            req.setAssignedToId(Integer.parseInt(params.get("assignedTo")));
        } else {
            req.setAssignedToId(5);
        }
        if (params.get("createdById") != null && !params.get("createdById").isEmpty()) {
            req.setCreatedById(Integer.parseInt(params.get("createdById")));
        } else {
            req.setCreatedById(4);
        }
        if (params.get("priority") != null && !params.get("priority").trim().isEmpty()) {
            try {
                req.setPriority(TaskPriority.valueOf(params.get("priority").trim().toUpperCase()));
            } catch (Exception e) {
                req.setPriority(TaskPriority.MEDIUM);
            }
        } else {
            req.setPriority(TaskPriority.MEDIUM);
        }
        if (params.get("status") != null && !params.get("status").trim().isEmpty()) {
            try {
                req.setStatus(TaskStatus.valueOf(params.get("status").trim().toUpperCase()));
            } catch (Exception e) {
                req.setStatus(TaskStatus.TODO);
            }
        } else {
            req.setStatus(TaskStatus.TODO);
        }
        if (params.get("deadline") != null && !params.get("deadline").isEmpty()) {
            req.setDeadline(java.time.LocalDate.parse(params.get("deadline")));
        } else {
            req.setDeadline(java.time.LocalDate.now().plusDays(7));
        }

        if ("UPDATE".equalsIgnoreCase(action)) {
            String idStr = params.get("taskId");
            if (idStr == null) idStr = params.get("id");
            Integer id = Integer.parseInt(idStr);
            return ResponseEntity.ok(ApiResponse.ok("Task updated", taskService.updateTask(id, req)));
        }

        return ResponseEntity.ok(ApiResponse.ok("Task created", taskService.createTask(req)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTask(@PathVariable Integer id, @Valid @RequestBody TaskRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("Task updated successfully", taskService.updateTask(id, request)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<TaskResponse>> updateTaskStatus(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        TaskStatus status = TaskStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(ApiResponse.ok("Task status updated", taskService.updateTaskStatus(id, status)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(@PathVariable Integer id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok(ApiResponse.ok("Task deleted successfully", null));
    }
}
