package com.GLPT.Backend.config;

import com.GLPT.Backend.Entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.servlet.HandlerInterceptor;

public class AuthInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler
    ) throws Exception {

        HttpSession session = request.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("currentUser") : null;

        String uri = request.getRequestURI();

        // Allow auth endpoints
        if(uri.startsWith("/users/oauth-register")||
        uri.startsWith("/users/complete-profile")){
            return true;
        }

        // Not Logged in
        if(user == null){
            response.sendRedirect("/login");
            return false;
        }

        // Profile not completed
        if(!user.isProfileCompleted()){
            response.sendRedirect("/complete-profile");
            return false;
        }

        return true;

    }

}
