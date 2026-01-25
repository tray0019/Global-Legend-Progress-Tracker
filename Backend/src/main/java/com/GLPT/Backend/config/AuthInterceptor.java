package com.GLPT.Backend.config;

import com.GLPT.Backend.Entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.servlet.HandlerInterceptor;

public class AuthInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {

        HttpSession session = request.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("currentUser") : null;

        String uri = request.getRequestURI();

        // Allow auth endpoints
        if(uri.startsWith("/users/oauth-register") ||
                uri.startsWith("/users/complete-profile") ||
                uri.equals("/login")) {   // optional
            return true;
        }

        // Not Logged in
        if(user == null){
            if("XMLHttpRequest".equals(request.getHeader("X-Requested-With")) || uri.startsWith("/api/")) {
                // API/XHR request → return 401 JSON
                response.setContentType("application/json");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("{\"error\":\"Not logged in\"}");
            } else {
                // Browser request → redirect to login
                response.sendRedirect("/login");
            }
            return false;
        }

        // Profile not completed
        if(!user.isProfileCompleted()){
            if("XMLHttpRequest".equals(request.getHeader("X-Requested-With")) || uri.startsWith("/api/")) {
                response.setContentType("application/json");
                response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                response.getWriter().write("{\"error\":\"Profile not completed\"}");
            } else {
                response.sendRedirect("/complete-profile");
            }
            return false;
        }

        return true;
    }


}
