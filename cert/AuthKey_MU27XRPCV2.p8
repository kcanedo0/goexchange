-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgr4FVB+KEDUTzmX0s
QbsjGZqXYumhmC4ZlKhCur5wrcegCgYIKoZIzj0DAQehRANCAATYUYqWMLVC8cZ+
mLAruMPTU73EjccuXW3VbTPnooVagy1Yh1ttsGGg+LQRVYb8+uxfMJz5/LregonP
zTTBjCb6
-----END PRIVATE KEY-----

com.gorentals.goexchange

curl -v \
-H "apns-topic: com.gorentals.goexchange" \
-H "apns-push-type: alert" \
-H "Authorization: bearer MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgr4FVB+KEDUTzmX0s
QbsjGZqXYumhmC4ZlKhCur5wrcegCgYIKoZIzj0DAQehRANCAATYUYqWMLVC8cZ+
mLAruMPTU73EjccuXW3VbTPnooVagy1Yh1ttsGGg+LQRVYb8+uxfMJz5/LregonP
zTTBjCb6" \
-d '{
    "aps": {
        "alert": {
            "title": "Test Notification",
            "body": "This is a test notification."
        },
        "sound": "default"
    }
}' \
https://api.development.push.apple.com/3/device/DEVICE_TOKEN

curl -X POST \
  -H "Authorization: key=YOUR_SERVER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "notification": {
          "title": "Test Notification",
          "body": "This is a test notification"
        },
        "to": "DEVICE_TOKEN"
      }' \
  https://fcm.googleapis.com/fcm/send



/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef, useState } from 'react';
import { Button, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import { WebView } from 'react-native-webview';
import Biometrics from 'react-native-biometrics';
import TouchID from 'react-native-touch-id';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

function App(): React.JSX.Element {
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [isFaceRequired, setIsFaceRequired] = useState(false);
  // Construct the URL with the query string
  // let url = `http://10.100.7.243:3000/login?source=${source}`;
  const url =
    'http://10.100.7.243:3000/login?' +
    new URLSearchParams({
      source: 'mobile',
    });
  const [biometryType, setBiometryType] = useState('');

  const checkBiometrics = () => {
    TouchID.isSupported({
      faceid: true, // Specify that Face ID is required
    })
      .then(biometryType => {
        setBiometryType(biometryType);
        authenticate();
      })
      .catch(error => console.error('Biometrics check error:', error));
  };

  const authenticate = () => {
    TouchID.authenticate('Authenticate to proceed', {
      faceid: true, // Specify that Face ID is required
    })
      .then(success => {
        // if (webviewRef.current) {
        const postData = {
          Success: success,
          ExpirationDate: expirationDate,
        };
        webviewRef.current?.postMessage(JSON.stringify(postData));
        setIsFaceRequired(false);
        // }
      })
      .catch(error => {
        // console.error('Authentication failed:', error) 
        if (
          error.name === 'LAErrorUserCancel' ||
          error.name === 'LAErrorSystemCancel'
        ) {
          // Handle cancellation
          const cancelData = {
            onCancel: true,
          };
          webviewRef.current?.postMessage(JSON.stringify(cancelData));
          setIsFaceRequired(false);
        }
      });
  };

  function onMessage(data: any) {
    setIsFaceRequired(data.nativeEvent.data);
    // alert(data.nativeEvent.data);
  }

  function sendDataToWebView() {
    if (webviewRef.current) {
      webviewRef.current.postMessage(url);
    }
  }

  useEffect(() => {
    if (isFaceRequired) {
      checkBiometrics();
    }
  }, [isFaceRequired]);

  useEffect(() => {
    sendDataToWebView();
    setExpirationDate(new Date(Date.now() + 20 * 60 * 1000));
  }, []);

  const webviewRef = useRef<WebView | null>(null);

  // const [permissions, setPermissions] = useState({});

  // useEffect(() => {
  //   const type = 'notification';
  //   PushNotificationIOS.addEventListener(type, onRemoteNotification);
  //   return () => {
  //     PushNotificationIOS.removeEventListener(type);
  //   };
  // });

  // const onRemoteNotification = (notification) => {
  //   const isClicked = notification.getData().userInteraction === 1;

  //   if (isClicked) {
  //     // Navigate user to another screen
  //   } else {
  //     // Do something else with push notification
  //   }
  //   // Use the appropriate result based on what you needed to do for this notification
  //   const result = PushNotificationIOS.FetchResult.NoData;
  //   notification.finish(result);
  // };

  // useEffect(() => {
  //   // Request permissions when component mounts
  //   PushNotificationIOS.requestPermissions();

  //   // Add event listener for receiving notifications
  //   const subscription = PushNotificationIOS.addEventListener(
  //     'notification',
  //     handleNotification
  //   );

  //   // Add event listener for getting device token
  //   const tokenSubscription = PushNotificationIOS.addEventListener(
  //     'register',
  //     handleRegister
  //   );

  //   return () => {
  //     // Remove event listeners when component unmounts
  //     subscription.remove();
  //     tokenSubscription.remove();
  //   };
  // }, []);

  // const handleNotification = (notification) => {
  //   // Handle received notification
  //   console.log('Received Notification:', notification);
  // };

  // const handleRegister = (deviceToken) => {
  //   // Handle device token
  //   console.log('Device Token:', deviceToken);
  // };

  const [permissions, setPermissions] = useState({});

  useEffect(() => {
    const type = 'notification';
    PushNotificationIOS.addEventListener(type, onRemoteNotification);
    return () => {
      PushNotificationIOS.removeEventListener(type);
    };
  });

  const onRemoteNotification = (notification) => {
    const isClicked = notification.getData().userInteraction === 1;

    if (isClicked) {
      // Navigate user to another screen
    } else {
      // Do something else with push notification
    }
    // Use the appropriate result based on what you needed to do for this notification
    const result = PushNotificationIOS.FetchResult.NoData;
    notification.finish(result);
  };

  const sendTestNotification = () => {
    // Send a test notification
    PushNotificationIOS.presentLocalNotification({
      alertTitle: 'Test Notification',
      alertBody: 'This is a test notification',
      applicationIconBadgeNumber: 1, // Increment app badge number
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <View style={{ alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() => sendDataToWebView()}
          style={{
            padding: 20,
            width: 300,
            marginTop: 100,
            backgroundColor: '#6751ff',
            alignItems: 'center',
          }}>
          <Text style={{ fontSize: 20, color: 'white' }}>
            Send Data To WebView / Website
          </Text>
        </TouchableOpacity>
      </View> */}
      <WebView
        // source={{
        //   uri: 'http://10.100.7.243:3000?source=mobile',
        //   method: 'POST',
        // }}
        source={{
          uri: url,
          method: 'POST',
        }}
        ref={webviewRef}
        onMessage={onMessage}
      />
      {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Biometry Type: {biometryType}</Text>
        <Button title="Check Biometrics" onPress={checkBiometrics} />
      </View> */}
      {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button title="Send Test Notification" onPress={sendTestNotification} />
      </View> */}
    </SafeAreaView>
  );
}

export default App;
