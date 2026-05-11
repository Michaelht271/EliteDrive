package com.car.backend.modules.file.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/files")
@Slf4j
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class FileUploadController {

	
    // Đường dẫn tương đối đến thư mục public/profile của frontend
    @Value("${app.upload-dir:../frontend/public/profile}")
    private String uploadDir;

    @PostMapping("/upload-profile")
    public ResponseEntity<?> uploadProfileImage(@RequestParam("file") MultipartFile file) {
        return processUpload(file, "../frontend/public/profile", "/profile/");
    }

    @PostMapping("/upload-car")
    public ResponseEntity<?> uploadCarImage(@RequestParam("file") MultipartFile file) {
        return processUpload(file, "../frontend/public/car", "/car/");
    }

    private ResponseEntity<?> processUpload(MultipartFile file, String targetDir, String urlPrefix) {
        log.info("Received upload request: {}, target: {}", file.getOriginalFilename(), targetDir);
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "File is empty"));
        }

        try {
            Path path = Paths.get(targetDir);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String fileName = UUID.randomUUID().toString() + extension;

            Path targetPath = path.resolve(fileName);
            Files.copy(file.getInputStream(), targetPath);

            log.info("File uploaded successfully to: {}", targetPath.toAbsolutePath());

            return ResponseEntity.ok(Map.of(
                "url", urlPrefix + fileName,
                "fileName", fileName
            ));
        } catch (IOException e) {
            log.error("Failed to upload file", e);
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to upload file: " + e.getMessage()));
        }
    }
}
