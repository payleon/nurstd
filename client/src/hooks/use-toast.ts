// Simple toast implementation for notifications
import { useState } from 'react';

interface Toast {
  id: string;
  title?: string;
  description: string;
  variant?: 'default' | 'destructive';
  // We don't expose type to the UI since it's only used internally
  duration?: number;
}

interface ToastOptions {
  title?: string;
  description: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

// Create a singleton pattern to manage toasts
type ToastState = {
  toasts: Toast[];
  addToast: (toast: ToastOptions) => void;
  removeToast: (id: string) => void;
}

// Map our semantic types to the UI variants
function mapTypeToVariant(type?: 'success' | 'error' | 'warning' | 'info'): 'default' | 'destructive' {
  switch(type) {
    case 'error':
      return 'destructive';
    case 'success':
    case 'warning':
    case 'info':
    default:
      return 'default';
  }
}

const toastState: ToastState = {
  toasts: [],
  addToast: (toast: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    const variant = mapTypeToVariant(toast.type);
    
    // Convert our options to the format expected by the Toast component
    const formattedToast: Toast = {
      id,
      title: toast.title,
      description: toast.description,
      variant,
      duration: toast.duration
    };
    
    toastState.toasts = [...toastState.toasts, formattedToast];
    
    // Log toast for debugging
    console.log(`[Toast - ${toast.type || 'info'}] ${toast.title ? toast.title + ': ' : ''}${toast.description}`);
    
    // Remove toast after duration
    setTimeout(() => {
      toastState.removeToast(id);
    }, toast.duration || 3000);
  },
  removeToast: (id: string) => {
    toastState.toasts = toastState.toasts.filter(t => t.id !== id);
  }
};

// For now we'll use a simple implementation that relies on console logs
export function toast(options: ToastOptions) {
  toastState.addToast(options);
}

// Hook for using toast in components
export function useToast() {
  // Return the toast function and the current toast stack
  return {
    toast,
    toasts: toastState.toasts || []
  };
}