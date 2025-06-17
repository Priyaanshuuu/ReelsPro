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
    }
}