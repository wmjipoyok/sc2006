export function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            const app = initializeApp(firebaseConfig);
            const messaging = getMessaging(app);
            getToken(messaging, { vapidKey: 'BIKm-OqsfzgKZhCH9oczK00Gq8gHLwLzvSKlrD3H1A0FuNKZW3x-D9xPoRbNbpnRTbVW5XL7c9AJVODdoV_pLAI' })
                .then((currentToken) => {
                    if (currentToken) {
                        console.log('currentToken: ', currentToken);
                    } else {
                        console.log("cannot get token");
                    }
                })
                .catch((err) => {
                    console.log('An error occurred while retrieving token. ', err);
                });
        } else {
            console.log("do not have permission");
        }
    })
}