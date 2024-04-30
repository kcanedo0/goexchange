//
//  NotificationManager.m
//  goexchange
//
//  Created by dna-admin on 4/25/24.
//

#import "NotificationManager.h"
#import <React/RCTLog.h>
#import "AppDelegate.h"
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
@implementation NotificationManager

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(getNativeString:(RCTResponseSenderBlock)callback)
{
  // Your implementation here
  NSString *nativeString = @"Hello from native";
  callback(@[nativeString]);
}

RCT_EXPORT_METHOD(getDeviceToken:(RCTResponseSenderBlock)callback)
{
  AppDelegate *appDelegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
  if (appDelegate.deviceTokenString != nil) {
    callback(@[appDelegate.deviceTokenString]);
  } else {
    callback(@[[NSNull null]]);
  }
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"RemoteNotificationReceived"];
}

- (void)sendEventToReactNative:(NSDictionary *)userInfo {
  [self sendEventWithName:@"RemoteNotificationReceived" body:userInfo];
}
@end