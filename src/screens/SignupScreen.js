// src/screens/SignupScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { auth, createUserWithEmailAndPassword, updateProfile, db, doc, setDoc } from '../../firebase';

export default function SignupScreen({ navigation }) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const onSignup = async () => {
    setErr('');
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(cred.user, { displayName });
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid, displayName, email: cred.user.email, createdAt: new Date()
      });
    } catch (e) { setErr(e.message); }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>
      {!!err && <Text style={styles.err}>{err}</Text>}
      <TextInput placeholder="Name" value={displayName} onChangeText={setDisplayName} style={styles.input}/>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none"/>
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input}/>
      <Button title="Sign Up" onPress={onSignup} />
      <Text style={styles.link} onPress={() => navigation.goBack()}>Back to login</Text>
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
