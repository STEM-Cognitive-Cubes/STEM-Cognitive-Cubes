import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BotIntroScreen1 from '../screens/BotIntroScreen1';
import BotIntroScreen2 from '../screens/BotIntroScreen2';
import BotChatScreen from '../screens/BotChatScreen';

export type BotStackParamList = {
  BotIntro1: undefined;
  BotIntro2: undefined;
  BotChat: undefined;
};

const Stack = createNativeStackNavigator<BotStackParamList>();
const BOT_INTRO_STORAGE_KEY = 'bot_intro_seen';

export default function BotStack() {
    const [initialRoute, setInitialRoute] = useState<keyof BotStackParamList | null>(null);

    useEffect(() => {
        (async () => {
            const hasSeenIntro = await AsyncStorage.getItem(BOT_INTRO_STORAGE_KEY);
            setInitialRoute(hasSeenIntro === 'true' ? 'BotChat' : 'BotIntro1');
        })();
    }, []);

    if (!initialRoute) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="BotIntro1" component={BotIntroScreen1} />
            <Stack.Screen name="BotIntro2" component={BotIntroScreen2} />
            <Stack.Screen name="BotChat" component={BotChatScreen} />
        </Stack.Navigator>
    );
}
