"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, AuthContextType } from "../types";
import { authService, userService } from "../services/api";
import { createClient } from "../lib/supabase/client";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      if (typeof window === "undefined") return;

      const saved = localStorage.getItem("dcc_user");
      if (saved) {
        try {
          const parsedUser = JSON.parse(saved);
          // Verify actual role in DB via API to bypass RLS
          try {
            const res = await fetch(
              `/api/profile?id=${parsedUser.id}&email=${parsedUser.email || ""}`,
            );
            if (res.ok) {
              const result = await res.json();
              if (result.profile) {
                const dbUser = result.profile;
                setUser({ ...parsedUser, ...dbUser });
                localStorage.setItem("dcc_user", JSON.stringify({ ...parsedUser, ...dbUser }));
              } else {
                setUser(parsedUser);
              }
            } else {
              setUser(parsedUser);
            }
          } catch (err) {
            console.error("API fetch error:", err);
            setUser(parsedUser);
          }
        } catch (e) {
          console.error(e);
        }
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event: string, session: any) => {
          if (event === "SIGNED_OUT") {
            setUser(null);
            localStorage.removeItem("dcc_user");
            localStorage.removeItem("dcc_token");
            queryClient.clear();
          } else if (event === "SIGNED_IN" && session?.user) {
            try {
              const res = await fetch(
                `/api/profile?id=${session.user.id}&email=${session.user.email || ""}`,
              );
              if (res.ok) {
                const result = await res.json();
                if (result.profile) {
                  const mergedUser = { ...session.user, ...result.profile };
                  setUser(mergedUser as User);
                  localStorage.setItem("dcc_user", JSON.stringify(mergedUser));
                }
              }
            } catch (e) {
              console.error("API fetch error on auth change", e);
            }
          }
        }
      );
      return () => subscription.unsubscribe();
    };
    checkSession();
  }, [queryClient, supabase.auth]);

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  const login = async (username: string, password: string): Promise<boolean> => {
    const response = await authService.login({ username, password });
    setUser(response.user);
    localStorage.setItem("dcc_user", JSON.stringify(response.user));
    localStorage.setItem("dcc_token", response.token);
    return true;
  };

  const loginWithGoogle = async (token: string): Promise<boolean> => {
    const response = await authService.loginWithGoogle(token);
    setUser(response.user);
    localStorage.setItem("dcc_user", JSON.stringify(response.user));
    localStorage.setItem("dcc_token", response.token);
    return true;
  };

  const register = async (data: { email: string; password: string; fullName: string }): Promise<boolean> => {
    await authService.signUp(data);
    return true;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem("dcc_user");
    localStorage.removeItem("dcc_token");
    queryClient.clear();
    window.location.href = "/login";
  };

  const updateUserProfileMutation = useMutation({
    mutationFn: (updatedData: Partial<User>) => {
      if (!user) throw new Error("No user");
      return authService.updateProfile(user.id, updatedData);
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      localStorage.setItem("dcc_user", JSON.stringify(updatedUser));
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: ({ current, newPass }: { current: string; newPass: string }) => {
      if (!user) throw new Error("No user");
      return authService.changePassword({
        userId: user.id,
        currentPassword: current,
        newPassword: newPass,
      });
    },
  });

  const addUserMutation = useMutation({
    mutationFn: userService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => userService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  const deleteUserMutation = useMutation({
    mutationFn: userService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] }),
  });

  // Simplified hasPermission that will be refined in integration
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.role?.toLowerCase() === "admin") return true;
    // Initial implementation, will use settings from BudgetContext in components if needed
    return false; 
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        login,
        register,
        loginWithGoogle,
        logout,
        updateUserProfile: async (data) => { await updateUserProfileMutation.mutateAsync(data); },
        addUser: async (data) => { await addUserMutation.mutateAsync(data); },
        updateUser: async (id, data) => { await updateUserMutation.mutateAsync({ id, data }); },
        deleteUser: async (id) => { await deleteUserMutation.mutateAsync(id); },
        changePassword: async (current, newPass) => { await changePasswordMutation.mutateAsync({ current, newPass }); },
        hasPermission: (p) => hasPermission(p as any),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
