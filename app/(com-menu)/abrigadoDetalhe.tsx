// app/abrigado-detalhe.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, Switch } from 'react-native';

export default function AbrigadoDetalhe() {
  const { nome, ferimento, condicoes } = useLocalSearchParams();
  const router = useRouter();

  const [novoNome, setNovoNome] = useState(nome as string);
  const [novoFerimento, setNovoFerimento] = useState(ferimento as string);
  const [novoVoluntario, setNovoVoluntario] = useState(false);
  const [habilidades, setHabilidades] = useState<string[]>([]);

  const toggleHabilidade = (habilidade: string) => {
    setHabilidades(prev =>
      prev.includes(habilidade) ? prev.filter(h => h !== habilidade) : [...prev, habilidade]
    );
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Detalhes do Abrigado</Text>

      <Text>Nome:</Text>
      <TextInput value={novoNome} onChangeText={setNovoNome} style={{ borderBottomWidth: 1 }} />

      <Text style={{ marginTop: 10 }}>Ferimento:</Text>
      <TextInput value={novoFerimento} onChangeText={setNovoFerimento} style={{ borderBottomWidth: 1 }} />

      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
        <Text>É voluntário?</Text>
        <Switch value={novoVoluntario} onValueChange={setNovoVoluntario} />
      </View>

      {novoVoluntario && (
        <View>
          <Text>Habilidades:</Text>
          {['Cozinhar', 'Cuidados Médicos', 'Organização'].map(h => (
            <View key={h} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Switch value={habilidades.includes(h)} onValueChange={() => toggleHabilidade(h)} />
              <Text>{h}</Text>
            </View>
          ))}
        </View>
      )}

      <Button title="Salvar" onPress={() => {
        // Enviar alterações para o backend, se existir
        router.back();
      }} />
    </ScrollView>
  );
}
