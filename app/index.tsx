import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, criarLocal } from '../services/api';

export default function Index() {
  const [nomeLocal, setNomeLocal] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [endereco, setEndereco] = useState('');
  const [quantidadeAbrigados, setQuantidadeAbrigados] = useState('');

  const iniciar = async () => {
    try {
      console.log('[INICIAR] Fazendo login...');
      await login(); // token salvo internamente
      console.log('[INICIAR] Login realizado com sucesso.');

      const dadosLocal = {
        nome: nomeLocal,
        capacidade: Number(capacidade),
        endereco,
        qtd_abrigados: Number(quantidadeAbrigados),
      };

      console.log('[INICIAR] Enviando para a API (criarLocal):', JSON.stringify(dadosLocal));

      const local = await criarLocal(dadosLocal);
      console.log('[INICIAR] Resposta da API (local):', local);

      await AsyncStorage.setItem('localId', local.id);
      console.log('[INICIAR] localId salvo no AsyncStorage:', local.id);

      router.push('/(com-menu)/lista');
    } catch (error) {
      console.error('[ERRO] Falha ao cadastrar local:', error);
      Alert.alert('Erro', 'Não foi possível cadastrar o local.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo_apoIA.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.titulo}>Organize melhor. Cuide melhor.</Text>
      <Text style={styles.texto}>
        O apo.IA é seu aliado em situações de emergência, ajudando a cadastrar abrigados, identificar voluntários e priorizar quem precisa de mais atenção.
      </Text>

      <TextInput
        placeholder="Nome do local"
        value={nomeLocal}
        onChangeText={setNomeLocal}
        style={styles.input}
      />
      <TextInput
        placeholder="Capacidade máxima"
        value={capacidade}
        onChangeText={setCapacidade}
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        placeholder="Endereço"
        value={endereco}
        onChangeText={setEndereco}
        style={styles.input}
      />
      <TextInput
        placeholder="Quantidade de abrigados"
        value={quantidadeAbrigados}
        onChangeText={setQuantidadeAbrigados}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button title="Iniciar" onPress={iniciar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 150,
    height: 150,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  texto: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 20,
  },
});
