package com.car.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class CodebaseApplication {
	
	public static void main(String[] args) {
		SpringApplication.run(CodebaseApplication.class, args);
	}
	
}
