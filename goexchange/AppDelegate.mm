#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <UserNotifications/UserNotifications.h>

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
  
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  const unsigned char *dataBuffer = (const unsigned char *)[deviceToken bytes];
  if (!dataBuffer)
    return;

  NSUInteger dataLength = [deviceToken length];
  NSMutableString *hexString  = [NSMutableString stringWithCapacity:(dataLength * 2)];
  for (int i = 0; i < dataLength; ++i)
    [hexString appendFormat:@"%02x", (unsigned int)dataBuffer[i]];

  NSLog(@"Device Token: %@", hexString);
  
  deviceTokenString = hexString;
  NSAssert(deviceTokenString != nil, @"deviceTokenString must not be nil");
}

- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  NSLog(@"Failed to register for remote notifications with error: %@", error);
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {
  NSLog(@"Received remote notification: %@", userInfo);
  completionHandler(UIBackgroundFetchResultNoData);
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
