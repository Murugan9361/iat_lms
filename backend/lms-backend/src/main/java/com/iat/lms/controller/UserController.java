package com.iat.lms.controller;

import com.iat.lms.dto.ApiResponse;
import com.iat.lms.dto.UserDto;
import com.iat.lms.entity.User;
import com.iat.lms.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<UserDto.Response>> createUser(
            @Valid @RequestBody UserDto.CreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User creator = userService.findByEmail(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(
                userService.createUser(request, creator.getId()), "User created"));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','HR')")
    public ResponseEntity<ApiResponse<List<UserDto.Response>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers(), "Users fetched"));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','HR') or #id == authentication.principal.id")
    public ResponseEntity<ApiResponse<UserDto.Response>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(id), "User fetched"));
    }

    @GetMapping("/role/{roleName}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','SALES_HEAD','TRAINER_HEAD')")
    public ResponseEntity<ApiResponse<List<UserDto.Response>>> getUsersByRole(@PathVariable String roleName) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUsersByRole(roleName), "Users fetched"));
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN','SALES_HEAD','TRAINER_HEAD')")
    public ResponseEntity<ApiResponse<List<UserDto.Response>>> searchUsers(@RequestParam String name) {
        return ResponseEntity.ok(ApiResponse.success(userService.searchUsers(name), "Search results"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<UserDto.Response>> updateUser(
            @PathVariable Long id,
            @RequestBody UserDto.UpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(userService.updateUser(id, request), "User updated"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success(null, "User deactivated"));
    }
}
