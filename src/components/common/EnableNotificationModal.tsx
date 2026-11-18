import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  X,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Sparkles
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Top Decorative Banner */}
        <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-blue-500 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-xl" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-indigo-400/20 rounded-full blur-lg" />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Animated Glowing Bell Icon */}
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-lg ring-8 ring-white/10">
            <BellRing className="w-8 h-8 text-amber-300 animate-bounce" />
          </div>

          <h3 className="text-lg font-bold tracking-tight">Enable Notifications</h3>
          <p className="text-xs text-white/90 mt-1 max-w-xs mx-auto leading-relaxed">
            Get instant desktop alerts for upcoming tasks, project deadlines, and team updates.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Simulated Outside-Browser Desktop Alert Preview */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <span>Outside-Browser Alert Preview</span>
              <span className="flex items-center gap-1 text-emerald-600 font-bold lowercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                native os
              </span>
            </div>

            <div className="flex items-start gap-3 p-2.5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 mt-0.5">
                <Bell className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  Personal Productivity Dashboard
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                  Task "design figma ui" assigned to Priya is approaching due date.
                </div>
              </div>
            </div>
          </div>

          {/* Feature Bullets */}
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Receive notifications even when working in other tabs or apps</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Never miss sprint deadlines and priority milestones</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Private & local to your device — zero spam</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={handleDismiss}
              className="w-full sm:w-auto flex-1 px-4 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors order-2 sm:order-1"
            >
              Maybe Later
            </button>

            <button
              onClick={handleEnable}
              disabled={isRequesting}
              className="w-full sm:w-auto flex-1 px-4 py-2.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 rounded-xl shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{isRequesting ? 'Requesting...' : 'Enable Notifications'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
