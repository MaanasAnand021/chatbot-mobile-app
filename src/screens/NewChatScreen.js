import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { ensureChat } from '../services/chat';

export default function NewChatScreen({ navigation }) {
  const [peerUid, setPeerUid] = useState('');

  const onCreate = async () => {
    if (!peerUid.trim()) return;
    try {
      const chatId = await ensureChat(peerUid.trim());
      navigation.replace('ChatRoom', { chatId, peer: { uid: peerUid.trim(), displayName: peerUid.trim() } });
    } catch (e) { Alert.alert('Error', e.message); }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Peer UID (demo)" style={styles.input} value={peerUid} onChangeText={setPeerUid}/>
      <Button title="Start Chat" onPress={onCreate} />
    </View>
  );
}
const styles = StyleSheet.create({
  container:{ flex:1, padding:20 },
  input:{ borderWidth:1, borderColor:'#ddd', borderRadius:8, padding:12, marginBottom:12 }
});
