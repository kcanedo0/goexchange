#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>
#import <UserNotifications/UserNotifications.h>

@interface AppDelegate : RCTAppDelegate <UIApplicationDelegate, UNUserNotificationCenterDelegate>
@property (nonatomic, strong) NSString *deviceTokenString;
@end
