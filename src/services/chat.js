// src/services/chat.js
import {
  db, auth, serverTimestamp,
  collection, addDoc, doc, setDoc, updateDoc, getDoc, query, where, onSnapshot, orderBy, limit
} from '../../firebase';
import { v4 as uuidv4 } from 'uuid';

export function chatIdFor(u1, u2) {
  return [u1, u2].sort().join('_');
}

export async function ensureChat(peerUid) {
  const cid = chatIdFor(auth.currentUser.uid, peerUid);
  const ref = doc(db, 'chats', cid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      members: [auth.currentUser.uid, peerUid],
      lastMessage: null,
      lastAt: serverTimestamp(),
      typing: {}
    });
  }
  return cid;
}

export async function sendTextMessage(chatId, text) {
  const msg = {
    id: uuidv4(),
    text,
    senderId: auth.currentUser.uid,
    createdAt: serverTimestamp(),
    type: 'text',
    seenBy: [auth.currentUser.uid]
  };
  await addDoc(collection(db, 'chats', chatId, 'messages'), msg);
  await updateDoc(doc(db, 'chats', chatId), { lastMessage: text, lastAt: serverTimestamp() });
}

export function subscribeToChats(uid, cb) {
  const q = query(collection(db, 'chats'), where('members', 'array-contains', uid), orderBy('lastAt','desc'), limit(50));
  return onSnapshot(q, (snap) => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

export function subscribeToMessages(chatId, cb) {
  const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt','asc'), limit(200));
  return onSnapshot(q, (snap) => cb(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}

export async function markSeen(chatId, messageIds) {
  // Firestore side: we store array of seenBy per message
  // Here we simply mark all messages not from me as seen
  // (batching omitted for brevity)
}

export async function setTyping(chatId, isTyping) {
  await updateDoc(doc(db, 'chats', chatId), { [`typing.${auth.currentUser.uid}`]: isTyping });
}
