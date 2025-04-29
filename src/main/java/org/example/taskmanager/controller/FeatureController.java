package org.example.taskmanager.controller;

import org.example.taskmanager.config.FeatureFlags.Features;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.togglz.core.manager.FeatureManager;

import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping("/api/features")
public class FeatureController {

    private final FeatureManager featureManager;

    @Autowired
    public FeatureController(FeatureManager featureManager) {
        this.featureManager = featureManager;
    }

    @GetMapping
    public ResponseEntity<List<FeatureDto>> getFeatures() {
        List<FeatureDto> features = new ArrayList<>();

        for (Features feature : Features.values()) {
            features.add(new FeatureDto(
                    feature.name(),
                    featureManager.getMetaData(feature).getLabel(),
                    featureManager.isActive(feature)
            ));
        }

        return ResponseEntity.ok(features);
    }

    @Data
    @NoArgsConstructor
    static class FeatureDto {
        private String name;
        private String description;
        private boolean enabled;

        public FeatureDto(String name, String description, boolean enabled) {
            this.name = name;
            this.description = description;
            this.enabled = enabled;
        }
    }
}
