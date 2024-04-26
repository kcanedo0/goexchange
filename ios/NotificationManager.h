//
//  NotificationManager.h
//  goexchange
//
//  Created by dna-admin on 4/25/24.
//

#ifndef NotificationManager_h
#define NotificationManager_h

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface NotificationManager : RCTEventEmitter <RCTBridgeModule>
- (void)sendEventToReactNative:(NSDictionary *)userInfo;
@end
#endif /* NotificationManager_h */
