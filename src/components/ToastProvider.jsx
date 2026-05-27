import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '14px',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
          style: {
            background: '#10b981',
            color: '#fff',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
          style: {
            background: '#ef4444',
            color: '#fff',
          },
        },
        loading: {
          duration: Infinity,
          style: {
            background: '#3b82f6',
            color: '#fff',
          },
        },
      }}
    />
  );
}