package com.adflow.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping({"/", "/index", "/index.html"})
    public String index() {
        return "index";
    }

    @GetMapping({"/login", "/login.html"})
    public String login() {
        return "login";
    }

    @GetMapping({"/register", "/register.html"})
    public String register() {
        return "register";
    }

    @GetMapping({"/dashboard", "/dashboard.html"})
    public String dashboard() {
        return "dashboard/dashboard";
    }

    @GetMapping({"/appointments", "/appointments.html"})
    public String appointments() {
        return "appointments/appointments";
    }

    @GetMapping({"/campaigns", "/campaigns.html"})
    public String campaigns() {
        return "campaigns/campaigns";
    }

    @GetMapping({"/tasks", "/tasks.html"})
    public String tasks() {
        return "tasks/tasks";
    }

    @GetMapping({"/assets", "/assets.html"})
    public String assets() {
        return "assets/assets";
    }

    @GetMapping({"/feedback", "/feedback.html"})
    public String feedback() {
        return "feedback/feedback";
    }

    @GetMapping({"/invoices", "/invoices.html"})
    public String invoices() {
        return "invoices/invoices";
    }

    @GetMapping({"/users", "/users.html"})
    public String users() {
        return "users/users";
    }

    @GetMapping({"/users/profile", "/users/user-profile.html"})
    public String userProfile() {
        return "users/user-profile";
    }
}
