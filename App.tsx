/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';

const { NotificationManager } = NativeModules;

// const eventEmitter = new NativeEventEmitter(NotificationManager);

import { WebView } from 'react-native-webview';
import Biometrics from 'react-native-biometrics';
import TouchID from 'react-native-touch-id';


function App(): React.JSX.Element {
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [isFaceRequired, setIsFaceRequired] = useState(false);
  const [deviceToken, setDeviceToken] = useState('');
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
          webviewRef.current?.postMessage(JSON.stringify(cancelData));
          setIsFaceRequired(false);
        }
      });
  };

  const handleCreateDeviceToken = async (user_id: string) => {
    try {
      const result = await fetch('http://10.110.7.39:5000/dt', {
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

  function sendDataToWebView() {
    if (webviewRef.current) {
      webviewRef.current.postMessage(url);
    }
  }

  useEffect(() => {
    sendDataToWebView();
    setExpirationDate(new Date(Date.now() + 20 * 60 * 1000));
    NotificationManager.getNativeString((nativeString: string) => {
      console.log(nativeString + ' from native module');
    });
    NotificationManager.getDeviceToken(deviceToken => {
      setDeviceToken(deviceToken);
      console.log(deviceToken + ' from native module');
    });
    // NotificationManager.sendRouteAndUserId((route, userId) => {
    //   console.log(route); // This will log the route
    //   console.log(userId); // This will log the user_id
    // });
  }, []);

  const webviewRef = useRef<WebView | null>(null);

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
