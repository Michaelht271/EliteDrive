package com.car.backend.modules.auth.enums;


import com.google.common.collect.Sets;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Set;
import java.util.stream.Collectors;

public enum Role {
	// ADMIN, USER, CUSTOMER, STAFF, MANAGER
	ADMIN(Sets.newHashSet( ApplicationUserPermission.READ,
	                       ApplicationUserPermission.WRITE,
	                       ApplicationUserPermission.DELETE,
	                       ApplicationUserPermission.UPDATE,
	                       ApplicationUserPermission.MANAGE_USERS,
	                       ApplicationUserPermission.MANAGE_BOOKINGS)),
	
	STAFF(Sets.newHashSet(ApplicationUserPermission.READ, ApplicationUserPermission.WRITE, ApplicationUserPermission.UPDATE,  ApplicationUserPermission.MANAGE_BOOKINGS)),
	CUSTOMER(Sets.newHashSet(ApplicationUserPermission.READ,
	                         ApplicationUserPermission.WRITE));

	
	private final Set<ApplicationUserPermission> permissions;
	
	Role(Set<ApplicationUserPermission> permissions) {
		this.permissions = permissions;
	}
	
	public Set<ApplicationUserPermission> getPermission() {
		return permissions;
	}
	
	public Set<GrantedAuthority> getGrantedAuthorities() {
		Set<GrantedAuthority> grantedAuthority = getPermission().stream().map(
				permission -> new SimpleGrantedAuthority(permission.getPermission())).collect(Collectors.toSet());
		
		grantedAuthority.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
		
		return grantedAuthority;
		
	}
}
