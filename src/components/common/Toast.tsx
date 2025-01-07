import React from 'react';
import { Alert, Toast as DaisyToast } from 'react-daisyui';
import { useToastStore } from '../../store/toastStore';

interface IToastProps {
  vertical?: 'top' | 'bottom';
  horizontal?: 'start' | 'center' | 'end';
}

export const Toast: React.FC<IToastProps> = ({ vertical = 'bottom', horizontal = 'end' }) => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className={`toast toast-${vertical} toast-${horizontal} z-[9999]`}>
      {toasts.map((toast, index) => (
        <DaisyToast key={index} onClick={() => removeToast(toast.message)}>
          <Alert status={toast.type}>{toast.message}</Alert>
        </DaisyToast>
      ))}
    </div>
  );
};
