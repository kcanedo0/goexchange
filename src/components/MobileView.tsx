import React, { useEffect, useRef, useState } from 'react';
import WebView from 'react-native-webview';
import {
  StyleSheet,
  SafeAreaView,
  Button,
  Text,
  TouchableOpacity,
  View,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';

import TouchID from 'react-native-touch-id';
import Config from 'react-native-ultimate-config';

function MobileView() {
  const webviewRef = useRef<WebView | null>(null);
  const [url, setUrl] = useState(
    '${Config.API_URL}/login?' +
      new URLSearchParams({
        source: Config.SOURCE,
      }),
  );
  const [biometryType, setBiometryType] = useState('');
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [deviceToken, setDeviceToken] = useState('');
  const [didReceivedNotification, setDidReceivedNotification] = useState(false);
  const { NotificationManager } = NativeModules;
  const eventEmitter = new NativeEventEmitter(NotificationManager);

  useEffect(() => {
    console.log(Config.API_URL);
    sendDataToWebView();
    setExpirationDate(new Date(Date.now() + 20 * 60 * 1000));
    NotificationManager.getNativeString((nativeString: string) => {
      console.log(nativeString + ' from native module');
    });
    NotificationManager.getDeviceToken(deviceToken => {
      setDeviceToken(deviceToken);
      console.log(deviceToken + ' from native module');
    });
    eventEmitter.addListener('RemoteNotificationReceived', event => {
      setDidReceivedNotification(true);
      setUrl(`${Config.API_URL}${event.route}`);
      setDidReceivedNotification(false);
    });

    // Equivalent to componentWillUnmount
    // return () => {
    //   eventListener.remove(); // Remember to remove the listener when you are done with it
    // };
  }, []);

  function onMessage(data: any) {
    const result = JSON.parse(data.nativeEvent?.data);

    const { isFaceIdRequired: showBiometric, user_id } = result || {};

    if (showBiometric) {
      return checkBiometrics();
    }

    if (user_id) {
      return handleCreateDeviceToken(user_id);
    }
    console.log(data.nativeEvent?.data);
  }

  const handleCreateDeviceToken = async (user_id: string) => {
    try {
      const result = await fetch('${Config.API_URL}/dt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_token: deviceToken,
          user_id,
        }),
      });
      const response = await result.json();
      console.log(
        'Device Token Created Successfully',
        JSON.stringify(response, null, 2),
      );
    } catch (error) {
      console.error('Error creating device token', error);
    }
  };

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
        // setIsFaceRequired(false);
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
          // webviewRef.current?.postMessage(JSON.stringify(cancelData));
          // setIsFaceRequired(false);
        }
      });
  };

  function sendDataToWebView() {
    if (webviewRef.current) {
      webviewRef.current.postMessage(JSON.stringify({ source: 'mobile' }));
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* {didReceivedNotification ? (
        <WebView
          source={{
            uri: url,
          }}
          ref={webviewRef}
          onMessage={onMessage}
        />
      ) : (
        <WebView
          source={{
            uri: url,
            method: 'POST',
          }}
          ref={webviewRef}
          onMessage={onMessage}
        />
      )} */}
      <WebView
        ref={webviewRef}
        source={{ uri: 'http://localhost:3000?source=mobile' }}
        onMessage={onMessage}
      />
    </SafeAreaView>
  );
}

export default MobileView;
