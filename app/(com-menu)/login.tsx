import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { router } from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const fazerLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      router.replace('/enviarDados');
    } catch (error) {
      Alert.alert('Erro no login', 'Email ou senha incorretos');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Você precisa estar logado para continuar.</Text>

      <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput placeholder="Senha" secureTextEntry onChangeText={setSenha} value={senha} />

      <Button title="Entrar" onPress={fazerLogin} />
      <Button title="Cadastrar" onPress={() => router.push('/cadastroLogin')} />
    </View>
  );
}
