import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, TextInput, Button, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import { auth, db, doc, onSnapshot } from '../../firebase';
import { sendTextMessage, subscribeToMessages, setTyping } from '../services/chat';

export default function ChatRoomScreen({ route }) {
  const { chatId } = route.params;
  const [messages, setMessages] = useState([]);
  const [chatMeta, setChatMeta] = useState(null);
  const [text, setText] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    const unsub = subscribeToMessages(chatId, setMessages);
    const unsub2 = onSnapshot(doc(db, 'chats', chatId), (d) => setChatMeta(d.data()));
    return () => { unsub(); unsub2(); };
  }, [chatId]);

  useEffect(() => {
    // mark typing off on unmount
    return () => setTyping(chatId, false).catch(()=>{});
  }, [chatId]);

  const onSend = async () => {
    if (!text.trim()) return;
    await sendTextMessage(chatId, text.trim());
    setText('');
    await setTyping(chatId, false);
    listRef.current?.scrollToEnd({ animated: true });
  };

  const isPeerTyping = !!chatMeta?.typing && Object.entries(chatMeta.typing)
    .some(([uid, val]) => uid !== auth.currentUser.uid && val);

  return (
    <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id || String(item.createdAt?.seconds || Math.random())}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={{ paddingVertical:10 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
      />
      {isPeerTyping && <TypingIndicator />}
      <View style={{ flexDirection:'row', padding:8, alignItems:'center', gap:8 }}>
        <TouchableOpacity onPress={onPickImage} style={{ paddingHorizontal:12, paddingVertical:10, borderWidth:1, borderColor:'#ddd', borderRadius:8 }}>
    
        </TouchableOpacity>
        <TextInput
          value={text}
          onChangeText={async (t) => {
            setText(t);
            await setTyping(chatId, !!t);
          }}
          placeholder="Message"
          style={{ flex:1, borderWidth:1, borderColor:'#ddd', borderRadius:8, paddingHorizontal:12, paddingVertical:10 }}
        />
        <Button title="Send" onPress={onSend} />
      </View>
    </KeyboardAvoidingView>
  );
}
