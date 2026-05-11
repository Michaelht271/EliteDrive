package com.car.backend.base;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.*;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Base entity class for all domain entities
 * Provides common auditing fields: createdBy, createdDate, lastModifiedBy, lastModifiedDate
 
 * Uses Spring Data JPA Auditing for automatic population of audit fields
 * Requires @EnableJpaAuditing and AuditorAware bean configuration
 *
 * @author Michael
 * @version 1.0
 * @since 2025
 */
@Getter
@Setter

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity implements Serializable {
	
	@Serial
	private static final long serialVersionUID = 1L;
	
	/**
	 * User ID who created this entity
	 * Automatically populated by Spring Data JPA Auditing
	 * Requires AuditorAware bean configuration
	 */
	@CreatedBy
	@Column(name = "CreatedBy", updatable = false)
	private Long createdBy;
	
	/**
	 * Timestamp when this entity was created
	 * Automatically populated by Spring Data JPA Auditing
	 */
	@CreatedDate
	@Column(name = "CreatedDate", nullable = false, updatable = false)
	private LocalDateTime createdDate;
	
	/**
	 * User ID who last updated this entity
	 * Automatically populated by Spring Data JPA Auditing
	 * Requires AuditorAware bean configuration
	 */
	@LastModifiedBy
	@Column(name = "LastModifiedBy")
	private Long lastModifiedBy;
	
	/**
	 * Timestamp when this entity was last updated
	 * Automatically populated by Spring Data JPA Auditing
	 */
	@LastModifiedDate
	@Column(name = "LastModifiedDate")
	private LocalDateTime lastModifiedDate;
	
	
	
	/**
	 * Get the ID of the entity
	 * Each concrete entity must implement this method
	 *
	 * @return entity ID
	 */
	public abstract Long getID();
	
	/**
	 * Update the user who modified this entity
	 * Use this method when you need to manually set the modifier
	 * (though Spring Auditing should handle this automatically)
	 *
	 * @param userId ID of the user who made the modification
	 */
	public void updateModifiedBy(Long userId) {
		this.lastModifiedBy = userId;
	}
	
	/**
	 * Check if this entity has been persisted to a database
	 *
	 * @return true if an entity has an ID (persisted), false otherwise
	 */
	public boolean isPersisted() {
		return this.getID() != null;
	}
	
	/**
	 * Check if this is a new entity (not yet persisted)
	 *
	 * @return true if an entity doesn't have an ID (new), false otherwise
	 */
	public boolean isNew() {
		return this.getID() == null;
	}
	
	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (!(o instanceof BaseEntity that)) return false;
		return getID() != null && getID().equals(that.getID());
	}
	
	@Override
	public int hashCode() {
		return getClass().hashCode();
	}
	
	@Override
	public String toString() {
		return String.format("%s[id=%d, createdDate=%s, createdBy=%d]",
		                     getClass().getSimpleName(),
		                     getID(),
		                     createdDate,
		                     createdBy);
	}
}