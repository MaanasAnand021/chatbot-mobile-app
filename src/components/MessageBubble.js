// src/components/MessageBubble.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { formatTime } from '../utils/time';
import { useAuth } from '../context/AuthContext';

export default function MessageBubble({ message }) {
  const { user } = useAuth();
  const isMe = message.senderId === user.uid;

  return (
    <View style={[styles.row, isMe ? styles.right : styles.left]}>
      <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}>
        {message.type === 'image' ? (
          <Text style={styles.text}>{message.text}</Text>
        ) : (
          <Text style={styles.text}>{message.text}</Text>
        )}
        <Text style={styles.time}>{formatTime(message.createdAt)}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  row:{ flexDirection:'row', marginVertical:4, paddingHorizontal:10 },
  left:{ justifyContent:'flex-start' },
  right:{ justifyContent:'flex-end' },
  bubble:{ maxWidth:'80%', borderRadius:16, padding:10 },
  bubbleMe:{ backgroundColor:'#DCF8C6', borderTopRightRadius:4 },
  bubbleThem:{ backgroundColor:'#fff', borderTopLeftRadius:4, borderWidth:1, borderColor:'#eee' },
  text:{ fontSize:16, lineHeight:20 },
  time:{ alignSelf:'flex-end', fontSize:11, opacity:0.6, marginTop:4 },
  image:{ width:220, height:220, borderRadius:12 }
});
