// src/screens/ChatListScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { auth, signOut, db, doc, getDoc } from '../../firebase';
import { subscribeToChats } from '../services/chat';

export default function ChatListScreen({ navigation }) {
  const [chats, setChats] = useState([]);
  const [userMap, setUserMap] = useState({}); // cache uid → user data

  // Subscribe to chats
  useEffect(() => {
    const unsub = subscribeToChats(auth.currentUser.uid, setChats);
    return () => unsub();
  }, []);

  // Fetch peer details (so we can show names instead of raw UIDs)
  useEffect(() => {
    async function fetchUsers() {
      for (let c of chats) {
        const peerId = c.members.find((m) => m !== auth.currentUser.uid);
        if (peerId && !userMap[peerId]) {
          const snap = await getDoc(doc(db, 'users', peerId));
          if (snap.exists()) {
            setUserMap((prev) => ({ ...prev, [peerId]: snap.data() }));
          }
        }
      }
    }
    if (chats.length) fetchUsers();
  }, [chats]);

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Chats</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button title="New" onPress={() => navigation.navigate('NewChat')} />
          <Button title="Logout" color="#c00" onPress={() => signOut(auth)} />
        </View>
      </View>

      {/* Chat List */}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#eee' }} />}
        renderItem={({ item }) => {
          const peerId = item.members.find((m) => m !== auth.currentUser.uid);
          const peer = userMap[peerId] || { uid: peerId, displayName: peerId };

          return (
            <TouchableOpacity
              style={styles.item}
              onPress={() =>
                navigation.navigate('ChatRoom', { chatId: item.id, peer })
              }
            >
              <Text style={styles.name}>{peer.displayName}</Text>
              <Text numberOfLines={1} style={styles.last}>
                {item.lastMessage || 'Say hi 👋'}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 24, fontWeight: '700' },
  item: { padding: 16, backgroundColor: '#fff' },
  name: { fontWeight: '600', marginBottom: 4 },
  last: { color: '#666' },
});
