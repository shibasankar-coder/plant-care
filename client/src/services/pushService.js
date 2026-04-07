import axios from 'axios';

// URL base for backend
const API_URL = 'http://localhost:5000/api/push';

// Helper to convert base64 VAPID key to Uint8Array
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export const initPushNotifications = async (userId = null, showAlertDialog = false) => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push notifications are not supported by this browser');
        return false;
    }

    try {
        // 1. Register Service Worker
        const register = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker Registered');

        // 2. Request Permission (or check if already denied)
        if (Notification.permission === 'denied') {
            if (showAlertDialog) {
                alert('Notifications are blocked! Please click the lock icon in your browser address bar to allow them.');
            }
            return false;
        }

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.warn('Notification permission not granted');
            if (permission === 'denied' && showAlertDialog) {
                alert('Notifications are blocked! Please click the lock icon in your browser address bar to allow them.');
            }
            return false;
        }

        // 3. Subscribe
        const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
        if (!publicVapidKey) {
            console.error('VITE_VAPID_PUBLIC_KEY is not defined in .env');
            return false;
        }

        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
        });

        // 4. Get or Create Anonymous ID
        let anonymousId = localStorage.getItem('plant_care_anon_id');
        if (!anonymousId) {
            anonymousId = 'anon_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('plant_care_anon_id', anonymousId);
        }

        // 5. Send to backend
        await axios.post(`${API_URL}/subscribe`, {
            subscription,
            anonymousId,
            userId,
            device: navigator.userAgent
        });
        
        console.log('Successfully subscribed to push notifications');
        return true;
    } catch (error) {
        console.error('Error initializing push notifications:', error);
        return false;
    }
};

export const testPushNotification = async (userId = null) => {
    try {
        const anonymousId = localStorage.getItem('plant_care_anon_id');
        await axios.post(`${API_URL}/test`, {
            userId,
            anonymousId
        });
        return true;
    } catch (error) {
        console.error('Error sending test push:', error);
        return false;
    }
};

export const unsubscribePush = async () => {
    try {
        if (!('serviceWorker' in navigator)) return;
        const register = await navigator.serviceWorker.ready;
        const subscription = await register.pushManager.getSubscription();
        if (subscription) {
            await axios.post(`${API_URL}/unsubscribe`, { endpoint: subscription.endpoint });
            await subscription.unsubscribe();
            console.log('Unsubscribed from push notifications');
        }
    } catch (error) {
        console.error('Error unsubscribing:', error);
    }
};
