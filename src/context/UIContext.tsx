"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { UIContextType } from "../types";
import { userService } from "../services/api";
import { useAuth } from "./AuthContext";

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  useEffect(() => {
    const savedSidebar = localStorage.getItem("dcc_sidebar_collapsed");
    if (savedSidebar) {
      setIsSidebarCollapsed(savedSidebar === "true");
    }
  }, []);

  useEffect(() => {
    if (user?.theme) {
      document.documentElement.setAttribute("data-theme", user.theme);
    } else {
      document.documentElement.setAttribute("data-theme", "blue");
    }
  }, [user?.theme]);

  const changeTheme = async (newTheme: string) => {
    document.documentElement.setAttribute("data-theme", newTheme);
    if (user) {
      try {
        await userService.update(user.id, { theme: newTheme as any });
      } catch (err) {
        console.error("Failed to persist theme", err);
      }
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("dcc_sidebar_collapsed", String(next));
      return next;
    });
  };

  return (
    <UIContext.Provider
      value={{
        isSidebarCollapsed,
        toggleSidebar,
        changeTheme,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) throw new Error("useUI must be used within a UIProvider");
  return context;
};
