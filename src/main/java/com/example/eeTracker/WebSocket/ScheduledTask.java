package com.example.eeTracker.WebSocket;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ScheduledTask {

    private final SimpMessagingTemplate messagingTemplate;

    public ScheduledTask(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    // @Scheduled(cron = "0 0 0 * * ?")   
    @Scheduled(cron = "0/30 * * * * ?")
    public void sendReminderToFrontEnd() {
        messagingTemplate.convertAndSend("/topic/report-request", "start-upload");
        System.out.println("Scheduled reminder sent to front end.");
    }
}
