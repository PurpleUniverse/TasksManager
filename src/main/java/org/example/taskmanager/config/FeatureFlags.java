package org.example.taskmanager.config;

import org.springframework.stereotype.Component;
import org.togglz.core.Feature;
import org.togglz.core.annotation.EnabledByDefault;
import org.togglz.core.annotation.Label;
import org.togglz.core.context.FeatureContext;

@Component
public class FeatureFlags {

    public enum Features implements Feature {
        @EnabledByDefault
        @Label("Task Categories - Ability to organize tasks into categories")
        TASK_CATEGORIES,

        @EnabledByDefault
        @Label("Task Priorities - Ability to set priority levels on tasks")
        TASK_PRIORITIES;

        public boolean isActive() {
            return FeatureContext.getFeatureManager().isActive(this);
        }
    }
}