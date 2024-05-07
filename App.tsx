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
  Alert,
  AppState,
} from 'react-native';

const { NotificationManager } = NativeModules;

const eventEmitter = new NativeEventEmitter(NotificationManager);

import { WebView } from 'react-native-webview';
import Biometrics from 'react-native-biometrics';
import TouchID from 'react-native-touch-id';
import Config from 'react-native-ultimate-config';
import MobileView from './src/components/MobileView';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App(): React.JSX.Element {
  // const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  // // const [isFaceRequired, setIsFaceRequired] = useState(false);
  // const [deviceToken, setDeviceToken] = useState('');
  // // const [didReceivedNotification, setDidReceivedNotification] = useState(false);
  // const [credential, setCredentials] = useState({
  //   email: '',
  //   password: '',
  // });
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // // const [url, setUrl] = useState(
  // //   'https://goexchange.v1.dnastaging.net/login?' +
  // //     new URLSearchParams({
  // //       source: 'mobile',
  // //     }),
  // // );
  // const [url, setUrl] = useState(
  //   `${Config.PORTAL_URL}/login?` +
  //     new URLSearchParams({
  //       source: Config.SOURCE,
  //     }),
  // );
  // const [biometryType, setBiometryType] = useState('');

  // const checkBiometrics = () => {
  //   TouchID.isSupported({
  //     faceid: true, // Specify that Face ID is required
  //   })
  //     .then(biometryType => {
  //       setBiometryType(biometryType);
  //       authenticate();
  //     })
  //     .catch(error => console.error('Biometrics check error:', error));
  // };

  // const authenticate = () => {
  //   TouchID.authenticate('Authenticate to proceed', {
  //     faceid: true, // Specify that Face ID is required
  //   })
  //     .then(async success => {
  //       // console.log('Authentication Successful', credential.email);
  //       // console.log('Authentication Successful', userCredentials.email);
  //       if (credential.email !== '' && credential.password !== '') {
  //         webviewRef.current?.postMessage(
  //           JSON.stringify({
  //             email: credential.email,
  //             password: credential.password,
  //           }),
  //         );
  //       }

  //       const postData = {
  //         Success: success,
  //         ExpirationDate: expirationDate,
  //       };
  //       webviewRef.current?.postMessage(JSON.stringify(postData));
  //       // setIsFaceRequired(false);
  //       // }
  //     })
  //     .catch(error => {
  //       // console.error('Authentication failed:', error)
  //       if (
  //         error.name === 'LAErrorUserCancel' ||
  //         error.name === 'LAErrorSystemCancel'
  //       ) {
  //         // Handle cancellation
  //         const cancelData = {
  //           onCancel: true,
  //         };
  //         // webviewRef.current?.postMessage(JSON.stringify(cancelData));
  //         // setIsFaceRequired(false);
  //       }
  //     });
  // };

  // const handleCreateDeviceToken = async (user_id: string) => {
  //   try {
  //     if (deviceToken && deviceToken !== null) {
  //       console.log('Device Token Already Exists' + deviceToken);
  //       const result = await fetch(`${Config.API_URL}/dt`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({
  //           device_token: deviceToken,
  //           user_id,
  //         }),
  //       });
  //       const response = await result.json();
  //       console.log(
  //         'Device Token Created Successfully',
  //         JSON.stringify(response, null, 2),
  //       );
  //     }
  //   } catch (error) {
  //     console.error('Error creating device token', error);
  //   }
  // };

  // async function onMessage(data: any) {
  //   const result = JSON.parse(data.nativeEvent?.data);
  //   Alert.alert('Message Received', data.nativeEvent?.data);
  //   const {
  //     isFaceIdRequired: showBiometric,
  //     user_id,
  //     userCredentials,
  //     tokenExpired: showTokenExpired,
  //   } = result || {};

  //   if (userCredentials && userCredentials !== null) {
  //     try {
  //       await AsyncStorage.setItem('LoginOnce', JSON.stringify(true));
  //       const storedCredentials = await AsyncStorage.getItem('UserCredentials');
  //       if (!storedCredentials) {
  //         await AsyncStorage.setItem(
  //           'UserCredentials',
  //           JSON.stringify(userCredentials),
  //         );
  //       }
  //     } catch (error) {
  //       // Error saving data
  //       // console.log(error);
  //     }
  //   }

  //   if (showBiometric) {
  //     return checkBiometrics();
  //   }

  //   if (showTokenExpired) {
  //     return retrieveData();
  //   }

  //   if (user_id) {
  //     return handleCreateDeviceToken(user_id);
  //   }
  //   console.log(data.nativeEvent?.data + 'From Native App');
  // }

  // async function retrieveData() {
  //   try {
  //     const value = await AsyncStorage.getItem('LoginOnce');
  //     console.log(value + 'Local Login');
  //     // if (value !== null) {
  //     //   const credential = await AsyncStorage.getItem('UserCredentials');
  //     //   console.log(credential + 'Credentials');
  //     //   console.log(credential + 'Local Storage');
  //     //   const parseCredential = JSON.parse(credential || '{}');
  //     //   setCredentials(parseCredential);
  //     //   checkBiometrics();
  //     // }
  //   } catch (error) {
  //     // Error retrieving data
  //     console.log(error);
  //   }
  // }

  // useEffect(() => {
  //   retrieveData();
  // }, []);

  // useEffect(() => {
  //   // sendDataToWebView();
  //   // if (webviewRef.current) {
  //   //   webviewRef.current.postMessage(url);
  //   // }
  //   // setExpirationDate(new Date(Date.now() + 20 * 60 * 1000));
  //   // Equivalent to componentWillUnmount
  //   // return () => {
  //   //   eventListener.remove(); // Remember to remove the listener when you are done with it
  //   // };
  // }, []);

  // useEffect(() => {
  //   const getDeviceToken = () => {
  //     NotificationManager.getDeviceToken(deviceToken => {
  //       if (deviceToken) {
  //         setDeviceToken(deviceToken);
  //         // console.log(deviceToken + ' from native module');
  //       } else {
  //         // If the device token is null, retry after a delay
  //         setTimeout(getDeviceToken, 5000); // Retry after 5 seconds
  //       }
  //     });
  //   };

  //   getDeviceToken();
  // }, []);

  // useEffect(() => {
  //   eventEmitter.addListener('RemoteNotificationReceived', event => {
  //     console.log(event);
  //     setDidReceivedNotification(true);
  //     setUrl(`${Config.PORTAL_URL}${event.route}`);
  //     setDidReceivedNotification(false);
  //   });
  // }, []);

  // const webviewRef = useRef<WebView | null>(null);
  // const [hasSentData, setHasSentData] = useState(false);

  // // function sendDataToWebView() {
  // //   if (webviewRef.current) {
  // //     webviewRef.current.postMessage(url);
  // //     console.log(url + 'From Native App');
  // //   }
  // // }

  // function sendDataToWebView() {
  //   if (!hasSentData && webviewRef.current) {
  //     webviewRef.current.postMessage(url);
  //     console.log(url + 'From Native App');
  //     setHasSentData(true);
  //     // retrieveData();
  //   }
  // }
  // const openSettings = () => {
  //   Linking.canOpenURL('app-settings:')
  //     .then(supported => {
  //       if (!supported) {
  //         console.log('Can\'t handle settings URL');
  //       } else {
  //         return Linking.openURL('app-settings:');
  //       }
  //     })
  //     .catch(err => console.error('An error occurred', err));
  // };

  // const showAlert = () => {
  //   Alert.alert(
  //     'Open Settings',
  //     'Do you want to open the settings?',
  //     [
  //       {
  //         text: 'Cancel',
  //         style: 'cancel',
  //       },
  //       { text: 'OK', onPress: () => openSettings() },
  //     ],
  //     { cancelable: false },
  //   );
  // };
  return (
    <MobileView />
    // <SafeAreaView style={{ flex: 1 }}>
    //   {/* <MobileView /> */}
    //   {/* {didReceivedNotification ? ( */}
    //   <WebView
    //     source={{ uri: url }}
    //     ref={webviewRef}
    //     onMessage={onMessage}
    //     onLoadEnd={sendDataToWebView}
    //   />
    //   {/* ) : (
    //     <WebView source={{ uri: url }} ref={webviewRef} onMessage={onMessage} />
    //   )} */}
    // </SafeAreaView>
  );
}

export default App;
