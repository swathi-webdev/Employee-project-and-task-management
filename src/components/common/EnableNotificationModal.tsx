import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  X
} from 'lucide-react';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  sendDesktopNotification
} from '../../utils/browserNotifications';
import { useToast } from '../../context/ToastContext';

interface EnableNotificationModalProps {
  onDismiss?: () => void;
}

export const EnableNotificationModal: React.FC<EnableNotificationModalProps> = ({ onDismiss }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [permission, setPermission] = useState<string>('default');
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    // Only prompt if notifications are supported and not already granted or permanently dismissed in this session
    if (!isNotificationSupported()) return;

    const currentPermission = getNotificationPermission();
    setPermission(currentPermission);

    const dismissed = sessionStorage.getItem('ems_notification_prompt_dismissed');
    if (currentPermission === 'default' && dismissed !== 'true') {
      // Short delay so the page loads smoothly first
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleEnable = async () => {
    setIsRequesting(true);
    try {
      const res = await requestNotificationPermission();
      setPermission(res);

      if (res === 'granted') {
        // Send a native OS desktop notification outside the browser window!
        sendDesktopNotification({
          title: 'Employee Management System (EMS)',
          body: '🎉 Notifications enabled! You will now receive alerts here even when working outside this browser.',
        });

        toast.success(
          'Desktop notifications are enabled! Outside browser alerts will now appear.',
          'Notifications Active'
        );
        setIsOpen(false);
        sessionStorage.setItem('ems_notification_prompt_dismissed', 'true');
      } else if (res === 'denied') {
        toast.info(
          'Browser notifications were blocked. You can re-enable them anytime from your browser address bar icon.',
          'Permission Blocked'
        );
        setIsOpen(false);
        sessionStorage.setItem('ems_notification_prompt_dismissed', 'true');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRequesting(false);
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('ems_notification_prompt_dismissed', 'true');
    if (onDismiss) onDismiss();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 p-3.5 animate-in slide-in-from-top-3 duration-300">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs relative">
          <BellRing className="w-4 h-4 text-brand-600 animate-bounce" />
          <span className="w-2 h-2 rounded-full bg-brand-500 absolute -top-0.5 -right-0.5 animate-ping" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <h4 className="text-xs font-bold text-slate-900 leading-tight">Enable Desktop Alerts</h4>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
            Get instant native alerts for project tasks outside this browser.
          </p>

          <div className="mt-2.5 flex items-center gap-2">
            <button
              onClick={handleEnable}
              disabled={isRequesting}
              className="px-3 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Bell className="w-3 h-3" />
              <span>{isRequesting ? 'Requesting...' : 'Enable Alerts'}</span>
            </button>

            <button
              onClick={handleDismiss}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
