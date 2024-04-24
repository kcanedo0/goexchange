import React, { useEffect, useRef, useState } from 'react';
import { Button, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import { WebView } from 'react-native-webview';
import TouchID from 'react-native-touch-id';

function MobileView() {
  // Biometrics.isSensorAvailable()
  // .then((biometryType) => {
  //   if (biometryType === Biometrics.BiometricsType.FaceID) {
  //     Biometrics.simplePrompt('Authenticate with Face ID')
  //       .then(() => {
  //         // Authentication successful
  //         console.log('Authentication successful');
  //       })
  //       .catch((error) => {
  //         // Authentication failed
  //         console.log('Authentication failed:', error);
  //       });
  //   } else {
  //     // Face ID not available, handle fallback
  //     console.log('Face ID not available');
  //   }
  // })
  // .catch((error) => {
  //   // Error retrieving biometry type
  //   console.log('Biometry type retrieval error:', error);
  // });

//   const [biometryType, setBiometryType] = useState('');

//   const checkBiometrics = () => {
//     TouchID.isSupported({
//       faceid: true, // Specify that Face ID is required
//     })
//       .then(biometryType => {
//         setBiometryType(biometryType);
//         authenticate();
//       })
//       .catch(error => console.error('Biometrics check error:', error));
//   };

//   const authenticate = () => {
//     TouchID.authenticate('Authenticate to proceed', {
//       faceid: true, // Specify that Face ID is required
//     })
//       .then(success => {
//         console.log('Authentication Successful');
//         // Proceed with your application logic here
//       })
//       .catch(error => console.error('Authentication failed:', error));
//   };

  const onMessage = event => {
    // Parse the message received from the WebView
    const message = JSON.parse(event.nativeEvent.data);

    alert('Source parameter received from the web app:', message);
    // Extract the source parameter from the message
    const source = message.source;

    // Log the source parameter received from the web app
    alert('Source parameter received from the web app:', source);
  };

  // function sendDataToWebView() {
  //   if (webviewRef.current) {
  //     webviewRef.current.postMessage({source: 'mobile'});
  //   }
  // }

  // function sendDataToWebView() {
  //   webviewRef.current.postMessage('Data from React Native App');
  // }
  function sendDataToWebView() {
    if (webviewRef.current) {
      webviewRef.current.postMessage(JSON.stringify({ source: 'mobile' }));
    }
  }

  const webviewRef = useRef<WebView | null>(null);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ alignItems: 'center' }}>
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
      </View>
      {/* <WebView
        ref={webviewRef}
        source={{ uri: 'http://localhost:3000?source=mobile' }}
        onMessage={onMessage}
      /> */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Biometry Type: {biometryType}</Text>
        <Button title="Check Biometrics" onPress={checkBiometrics} />
      </View>
    </SafeAreaView>
  );
}

export default WebView;
