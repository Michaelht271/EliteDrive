package com.car.backend.modules.auth.enums;

import lombok.Getter;

@Getter
public enum ApplicationUserPermission {
	READ("read"),
	WRITE("write"),
	UPDATE("update"),
	DELETE("delete"),
	
	// User management
	MANAGE_USERS("manage:users"),
	VIEW_USERS("view:users"),
	
	// Booking management
	MANAGE_BOOKINGS("manage:bookings"),
	VIEW_BOOKINGS("view:bookings"),
	CREATE_BOOKING("create:booking"),
	CANCEL_BOOKING("cancel:booking"),
	
	// Service management
	MANAGE_SERVICES("manage:services"),
	VIEW_SERVICES("view:services"),
	
	// Payment
	PROCESS_PAYMENT("process:payment"),
	REFUND_PAYMENT("refund:payment");


    private final String permission;

    ApplicationUserPermission(String permission) {
        this.permission = permission;
    }


}
