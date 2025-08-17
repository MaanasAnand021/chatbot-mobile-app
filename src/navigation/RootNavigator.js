import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ChatListScreen from '../screens/ChatListScreen';
import NewChatScreen from '../screens/NewChatScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user, initializing } = useAuth();
  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="Chats" component={ChatListScreen} />
            <Stack.Screen name="NewChat" component={NewChatScreen} options={{ title: 'New Chat' }}/>
            <Stack.Screen name="ChatRoom" component={ChatRoomScreen} options={({ route }) => ({ title: route.params?.peer?.displayName || 'Chat' })}/>
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
