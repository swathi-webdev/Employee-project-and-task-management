/**
 * Utility for handling Browser Web Notifications (Desktop & System Alerts outside the browser)
 */

export const isNotificationSupported = (): boolean => {
  return typeof window !== 'undefined' && 'Notification' in window;
};

export const getNotificationPermission = (): NotificationPermission | 'unsupported' => {
  if (!isNotificationSupported()) return 'unsupported';
  return Notification.permission;
};

export const requestNotificationPermission = async (): Promise<NotificationPermission | 'unsupported'> => {
  if (!isNotificationSupported()) return 'unsupported';
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('Failed to request notification permission:', err);
    return Notification.permission;
  }
};

export interface DesktopNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  onClick?: () => void;
}

export const sendDesktopNotification = (
  payload: DesktopNotificationPayload
): Notification | null => {
  if (!isNotificationSupported()) {
    console.warn('Browser notifications are not supported in this environment.');
    return null;
  }

  if (Notification.permission !== 'granted') {
    console.info('Notification permission is not granted.');
    return null;
  }

  try {
    const notification = new Notification(payload.title, {
      body: payload.body,
      icon: payload.icon || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      tag: payload.tag || 'ems-general',
      badge: payload.icon,
    });

    notification.onclick = () => {
      window.focus();
      if (payload.onClick) {
        payload.onClick();
      }
      notification.close();
    };

    return notification;
  } catch (err) {
    console.error('Error creating native desktop notification:', err);
    return null;
  }
};
