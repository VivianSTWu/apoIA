import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function Index() {
  const [nomeLocal, setNomeLocal] = useState('');
  const [capacidade, setCapacidade] = useState('');

  const iniciar = () => {
    console.log('Nome do local:', nomeLocal);
    console.log('Capacidade máxima:', capacidade);
    router.push('/(com-menu)/lista');
  };

  return (
    <View style={styles.container}>
      {/* Espaço para o logo */}
      <View style={styles.logoContainer}>
        {/* Substitua 'require' pelo caminho correto do logo */}
        <Image
          source={require('../assets/logo_apoIA.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Texto explicativo */}
      <Text style={styles.titulo}>Organize melhor. Cuide melhor.</Text>
      <Text style={styles.texto}>
        O apo.IA é seu aliado em situações de emergência, ajudando a cadastrar abrigados, identificar voluntários e priorizar quem precisa de mais atenção. De forma inteligente, rápida e organizada.
      </Text>

      {/* Formulário */}
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
