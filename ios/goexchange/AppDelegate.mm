#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <UserNotifications/UserNotifications.h>
#import "NotificationManager.h"
#import <React/RCTBridge.h>
#import <React/RCTEventDispatcher.h>

@implementation AppDelegate
NSString *deviceTokenString;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"goexchange";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  // Request permission to send notifications
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  [center requestAuthorizationWithOptions:(UNAuthorizationOptionAlert + UNAuthorizationOptionSound + UNAuthorizationOptionBadge)
                         completionHandler:^(BOOL granted, NSError * _Nullable error) {
    if (granted) {
      dispatch_async(dispatch_get_main_queue(), ^{
        [[UIApplication sharedApplication] registerForRemoteNotifications];
      });
    }
  }];

  // Set the delegate
  center.delegate = self;
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  const unsigned char *dataBuffer = (const unsigned char *)[deviceToken bytes];
  if (!dataBuffer) {
    // If the device token is null, attempt to register for remote notifications again
    dispatch_async(dispatch_get_main_queue(), ^{
      [[UIApplication sharedApplication] registerForRemoteNotifications];
    });
    return;
  }

  NSUInteger dataLength = [deviceToken length];
  NSMutableString *hexString  = [NSMutableString stringWithCapacity:(dataLength * 2)];
  for (int i = 0; i < dataLength; ++i)
    [hexString appendFormat:@"%02x", (unsigned int)dataBuffer[i]];

  NSLog(@"Device Token: %@", hexString);

  self.deviceTokenString = hexString;
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  NSLog(@"Failed to register for remote notifications with error: %@", error);
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
  NSLog(@"Received remote notification: %@", userInfo);

  [self.bridge.eventDispatcher sendAppEventWithName:@"RemoteNotificationReceived" body:userInfo];

  if (application.applicationState == UIApplicationStateActive) {
    application.applicationIconBadgeNumber = 0;
  }

  NSInteger currentBadgeCount = [UIApplication sharedApplication].applicationIconBadgeNumber;
  [UIApplication sharedApplication].applicationIconBadgeNumber = currentBadgeCount + 1;

  completionHandler(UIBackgroundFetchResultNoData);
}

- (void)applicationDidBecomeActive:(UIApplication *)application {

  application.applicationIconBadgeNumber = 0;
  
}

- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler {

  completionHandler(UNNotificationPresentationOptionAlert + UNNotificationPresentationOptionSound + UNNotificationPresentationOptionBadge);
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self getBundleURL];
}

- (NSURL *)getBundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
