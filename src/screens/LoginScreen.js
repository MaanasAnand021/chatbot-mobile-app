// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { signInWithEmailAndPassword, auth } from '../../firebase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const onLogin = async () => {
    setErr('');
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e) { setErr(e.message); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      {!!err && <Text style={styles.err}>{err}</Text>}
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input}/>
      <Button title="Log In" onPress={onLogin} />
      <Text style={styles.link} onPress={() => navigation.navigate('Signup')}>Create an account</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{ flex:1, padding:20, justifyContent:'center' },
  title:{ fontSize:24, fontWeight:'600', marginBottom:12 },
  input:{ borderWidth:1, borderColor:'#ddd', borderRadius:8, padding:12, marginBottom:12 },
  err:{ color:'crimson', marginBottom:8 },
  link:{ textAlign:'center', marginTop:12, textDecorationLine:'underline' }
});
