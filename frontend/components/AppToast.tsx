"use client";

import { Toaster } from "react-hot-toast";

export default function AppToast() {
    return (
        <Toaster
            position="top-right"
            toastOptions={{
                style: {
                    background: "#1f2937",
                    color: "#fff",
                    borderRadius: "12px",
                    border: "1px solid #374151",
                    padding: "12px 16px",
                },
            }}
        />
    );
}
