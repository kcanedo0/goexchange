import React, { useEffect, useRef, useState } from 'react';
import WebView from 'react-native-webview';
import {
  SafeAreaView,
  NativeModules,
  NativeEventEmitter,
  AppState,
} from 'react-native';

import TouchID from 'react-native-touch-id';
import Config from 'react-native-ultimate-config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'base-64';

if (!global.atob) {
  global.atob = decode;
}
function MobileView() {
  const webviewRef = useRef<WebView | null>(null);
  const [url, setUrl] = useState(
    `${Config.PORTAL_URL}/login?` +
      new URLSearchParams({
        source: Config.SOURCE,
      }),
  );
  const [biometryType, setBiometryType] = useState('');
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [deviceToken, setDeviceToken] = useState('');
  const [showWebView, setShowWebView] = useState(true);
  const [showURL, setShowURL] = useState(true);
  const { NotificationManager } = NativeModules;
  const eventEmitter = new NativeEventEmitter(NotificationManager);
  const [appState, setAppState] = useState(AppState.currentState);

  function sendDataToWebView() {
    if (webviewRef.current) {
      webviewRef.current.postMessage(url);
    }
  }

  async function handleStorage() {
    const localStorageURL = await AsyncStorage.getItem('URL');
    const token = await AsyncStorage.getItem('Token');
    const parts = token.split('.');
    const decodedPayload = JSON.parse(atob(parts[1]));
    setUrl(JSON.parse(localStorageURL || ''));
    const currentUnixTimestamp = Math.floor(Date.now() / 1000);
    // if (token) {
    //   console.log(token + 'Token');
    //   if (showURL) {
    //     setShowWebView(false);
    //   }
    //   checkBiometrics();
    // }
    if (decodedPayload.exp > currentUnixTimestamp) {
      console.log(token + 'Token');
      if (showURL) {
        setShowWebView(false);
      }
      checkBiometrics();
    }
  }

  useEffect(() => {
    const getDeviceToken = () => {
      NotificationManager.getDeviceToken(deviceToken => {
        if (deviceToken) {
          setDeviceToken(deviceToken);
          // console.log(deviceToken + ' from native module');
        } else {
          setTimeout(getDeviceToken, 5000); // Retry after 5 seconds
        }
      });
    };

    getDeviceToken();
  }, []);

  useEffect(() => {
    eventEmitter.addListener('RemoteNotificationReceived', event => {
      console.log(event);
      // setDidReceivedNotification(true);
      setUrl(`${Config.PORTAL_URL}${event.route}`);
      // setDidReceivedNotification(false);
    });
  }, []);

  useEffect(() => {
    sendDataToWebView();
    setExpirationDate(new Date(Date.now() + 20 * 60 * 1000));
    handleStorage();
    // setDidReceivedNotification(true);
    // console.log(didReceivedNotification);
  }, []);

  async function onMessage(data: any) {
    const result = JSON.parse(data.nativeEvent?.data);
    console.log(result);
    const { token, isFaceIdRequired: showBiometric, user_id } = result || {};

    if (token) {
      console.log('Access Token', token);
      try {
        await AsyncStorage.setItem('Token', JSON.stringify(token));
      } catch (error) {
        console.error('Error decoding JWT token:', error);
        // Handle the error
      }
    }

    if (user_id) {
      return handleCreateDeviceToken(user_id);
    }

    if (showBiometric) {
      // setIsSetData(showBiometric);
      return checkBiometrics();
    }
  }

  const handleCreateDeviceToken = async (user_id: string) => {
    try {
      const result = await fetch(`${Config.API_URL}/dt`, {
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

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, [appState]);

  const handleAppStateChange = async (nextAppState: any) => {
    console.log('Current app state: ', appState);
    console.log('Next app state: ', nextAppState);

    if (appState.match(/background/) && nextAppState === 'active') {
      console.log('App has come to the foreground!');
      const localStorageURL = await AsyncStorage.getItem('Token');
      if (localStorageURL) {
        setShowWebView(false);
        checkBiometrics();
      }
    } else if (appState === 'active' && nextAppState.match(/background/)) {
      console.log('App has gone to the background!');
    }

    setAppState(nextAppState);
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
      .then((success: any) => {
        // if (!showURL) {
        console.log('Im here');
        setShowWebView(true);
        // if (didReceivedNotification) {
        const postData = {
          Success: success,
          ExpirationDate: expirationDate,
        };
        webviewRef.current?.postMessage(JSON.stringify(postData));
      })
      .catch((error: { name: string }) => {
        // console.error('Authentication failed:', error)
        if (
          error.name === 'LAErrorUserCancel' ||
          error.name === 'LAErrorSystemCancel'
        ) {
          const cancelData = {
            onCancel: true,
          };
        }
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* {showURL ? (
        <WebView
          source={{ uri: url }}
          ref={webviewRef}
          onMessage={onMessage}
          // onLoadEnd={sendDataToWebView}
        />
      ) : (
        <></>
      )} */}
      {showWebView ? (
        <WebView
          source={{
            uri: url,
          }}
          ref={webviewRef}
          onMessage={onMessage}
          onNavigationStateChange={async navState => {
            await AsyncStorage.setItem('URL', JSON.stringify(navState.url));
            setUrl(navState.url);
          }}
        />
      ) : (
        <></>
      )}
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
          }}
          ref={webviewRef}
          onMessage={onMessage}
        />
      )} */}
    </SafeAreaView>
  );
}

export default MobileView;
