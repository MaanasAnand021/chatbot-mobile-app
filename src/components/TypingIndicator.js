// src/components/TypingIndicator.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TypingIndicator() {
  return (
    <View style={styles.wrap}>
      <View style={styles.dot}/><View style={styles.dot}/><View style={styles.dot}/>
      <Text style={styles.text}>typing…</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  wrap:{ flexDirection:'row', alignItems:'center', paddingHorizontal:12, paddingVertical:6 },
  dot:{ width:6, height:6, borderRadius:3, marginRight:6, backgroundColor:'#aaa' },
  text:{ color:'#666', fontSize:12 }
});
