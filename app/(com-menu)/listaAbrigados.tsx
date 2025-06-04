import React, { useState } from 'react';
import { View, FlatList, TextInput, StyleSheet, Text } from 'react-native';
import AbrigadoItem, { Abrigado } from '../../components/AbrigadoItem';
import { Checkbox } from 'react-native-paper';

const abrigadosMock: Abrigado[] = [
  {
    nome: 'João Silva',
    ferimento: 'Muito Graves',
    condicoes: ['Hipertensão', 'Diabetes'],
  },
  {
    nome: 'Maria Oliveira',
    ferimento: 'Leves',
    condicoes: [],
  },
  {
    nome: 'Carlos Santos',
    ferimento: 'Graves',
    condicoes: ['Asma'],
  },
  {
    nome: 'Ana Souza',
    ferimento: 'Nenhum',
    condicoes: ['Epilepsia'],
  },
];

const prioridade = {
  'Muito Graves': 3,
  Graves: 2,
  Leves: 1,
  Nenhum: 0,
};

const todasCondicoes = ['Diabetes', 'Epilepsia', 'Hipertensão', 'Asma'];

export default function ListaAbrigados() {
  const [busca, setBusca] = useState('');
  const [filtrosCondicoes, setFiltrosCondicoes] = useState<string[]>([]);

  const toggleCondicao = (cond: string) => {
    setFiltrosCondicoes((prev) =>
      prev.includes(cond)
        ? prev.filter((c) => c !== cond)
        : [...prev, cond]
    );
  };

  const filtrados = abrigadosMock.filter((a) => {
    const nomeMatch = a.nome.toLowerCase().includes(busca.toLowerCase());
    const condicoesMatch =
      filtrosCondicoes.length === 0 ||
      a.condicoes.some((c) => filtrosCondicoes.includes(c));
    return nomeMatch && condicoesMatch;
  });

  const ordenados = filtrados.sort(
    (a, b) => prioridade[b.ferimento] - prioridade[a.ferimento]
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar por nome"
        value={busca}
        onChangeText={setBusca}
        style={styles.input}
      />

      <Text style={styles.subtitulo}>Filtrar por condições médicas:</Text>
      {todasCondicoes.map((cond) => (
        <Checkbox.Item
          key={cond}
          label={cond}
          status={filtrosCondicoes.includes(cond) ? 'checked' : 'unchecked'}
          onPress={() => toggleCondicao(cond)}
        />
      ))}

      <FlatList
        data={ordenados}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <AbrigadoItem abrigado={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  subtitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 4,
  },
});
