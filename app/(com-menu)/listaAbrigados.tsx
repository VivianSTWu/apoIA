// app/(com-menu)/lista-abrigados.tsx
import React, { useState } from 'react';
import { View, FlatList, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AbrigadoItem from '../../components/AbrigadoItem';

const abrigadosMock = [
  {
    id: '1',
    nome: 'João Silva',
    ferimentos: 'Muito Graves',
    doencas: { hipertensao: true, diabetes: true },
  },
  {
    id: '2',
    nome: 'Maria Oliveira',
    ferimentos: 'Leves',
    doencas: {},
  },
  {
    id: '3',
    nome: 'Carlos Santos',
    ferimentos: 'Graves',
    doencas: { respiratoria: true },
  },
  {
    id: '4',
    nome: 'Ana Souza',
    ferimentos: 'Nenhum',
    doencas: { epilepsia: true },
  },
];

const prioridade = {
  'Muito Graves': 3,
  Graves: 2,
  Leves: 1,
  Nenhum: 0,
};

const todasCondicoes = ['diabetes', 'epilepsia', 'hipertensao', 'respiratoria', 'cardiaca', 'mobilidade', 'mental', 'tea', 'hiv'];

export default function ListaAbrigados() {
  const [busca, setBusca] = useState('');
  const [filtrosCondicoes, setFiltrosCondicoes] = useState<string[]>([]);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const router = useRouter();

  const toggleCondicao = (cond: string) => {
    setFiltrosCondicoes((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  };

  const filtrados = abrigadosMock.filter((a) => {
    const nomeMatch = a.nome.toLowerCase().includes(busca.toLowerCase());
    const condicoesAtivas = a.doencas
      ? Object.entries(a.doencas)
          .filter(([k, v]) => k !== 'outraDescricao' && v)
          .map(([k]) => k)
      : [];
    const condicoesMatch =
      filtrosCondicoes.length === 0 ||
      condicoesAtivas.some((c) => filtrosCondicoes.includes(c));
    return nomeMatch && condicoesMatch;
  });

  const ordenados = filtrados.sort((a, b) => {
    const prioridadeA = prioridade[a.ferimentos || 'Nenhum'] || 0;
    const prioridadeB = prioridade[b.ferimentos || 'Nenhum'] || 0;
    return prioridadeB - prioridadeA;
  });

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Buscar por nome"
        value={busca}
        onChangeText={setBusca}
        style={styles.input}
      />

      <TouchableOpacity style={styles.filtroBotao} onPress={() => setMostrarFiltros(!mostrarFiltros)}>
        <MaterialIcons name="filter-list" size={20} color="#333" />
        <Text style={styles.filtroTexto}>Filtros</Text>
      </TouchableOpacity>

      {mostrarFiltros && (
        <>
          <Text style={styles.subtitulo}>Filtrar por condições médicas:</Text>
          {todasCondicoes.map((cond) => (
            <Checkbox.Item
              key={cond}
              label={cond.charAt(0).toUpperCase() + cond.slice(1)}
              status={filtrosCondicoes.includes(cond) ? 'checked' : 'unchecked'}
              onPress={() => toggleCondicao(cond)}
            />
          ))}
        </>
      )}

      <FlatList
        data={ordenados}
        renderItem={({ item }) => (
          <AbrigadoItem abrigado={{
            nome: item.nome,
            ferimento: item.ferimentos,
            condicoes: Object.entries(item.doencas || {})
              .filter(([chave, valor]) => chave !== 'outraDescricao' && valor)
              .map(([chave]) => chave),
          }} />
        )}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  filtroBotao: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  filtroTexto: {
    fontSize: 16,
  },
});
