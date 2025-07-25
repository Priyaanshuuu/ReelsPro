"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type NotificationType = "success" | "Error"| "info"| "warning";

interface NotificationContextType{
    showNotification:(
        message: string,
        type: NotificationType,
    )=> void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined
);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notification, setNotification] = useState<{
        message: string,
        type: NotificationType;
        id: number;
    }| null>(null);

    const showNotification = (message: string , type : NotificationType)=>{
        const id = Date.now();
        setNotification({ message, type, id });
        setTimeout(()=>{
            setNotification((current)=>(current?.id === id? null: current));
        }, 3000);
        }
    return(
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {notification && (
                <div className="toast toast-bottom toast-end z-[100]">
                    <div className={`alert ${getAlertClass(notification.type)}`}>
                        <span>{notification.message}</span>
                    </div>
                </div>
            )}
        </NotificationContext.Provider>
    )
    };
       function getAlertClass(type: NotificationType): string {
  switch (type) {
    case "success":
      return "alert-success";
    case "Error":
      return "alert-error";
    case "warning":
      return "alert-warning";
    case "info":
      return "alert-info";
    default:
      return "alert-info";
  }
}

export function useNotification(){
    const context = useContext(NotificationContext);
    if(context== undefined){
        throw new Error(
            "usenotification must be used with a notificationProvider"
        );
    }
    return context;
}
// This page handles the activities of the user that is it will show that is the reel posted and other stuffs

