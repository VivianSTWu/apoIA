// app/cadastro.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { router } from 'expo-router';

export default function CadastroLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const cadastrar = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      Alert.alert('Cadastro realizado com sucesso');
      router.replace('/enviar-dados');
    } catch (error) {
      Alert.alert('Erro no cadastro', 'Verifique os dados e tente novamente');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Email" onChangeText={setEmail} value={email} />
      <TextInput placeholder="Senha" secureTextEntry onChangeText={setSenha} value={senha} />
      <Button title="Cadastrar" onPress={cadastrar} />
    </View>
  );
}
