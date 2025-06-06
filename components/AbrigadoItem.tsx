import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export type Abrigado = {
  nome: string;
  ferimento: 'Nenhum' | 'Leves' | 'Graves' | 'Muito Graves';
  condicoes: string[];
};

export default function AbrigadoItem({ abrigado }: { abrigado: Abrigado }) {
  const router = useRouter();

  return (
    <Pressable onPress={() => {
      router.push({
        pathname: '/abrigadoDetalhe',
        params: {
          nome: abrigado.nome,
          ferimento: abrigado.ferimento,
          condicoes: abrigado.condicoes.join(','), // se quiser passar também
        },
      });
    }}>
      <View style={{ padding: 12, borderBottomWidth: 1, borderColor: '#eee' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{abrigado.nome}</Text>
        <Text style={{ color: '#d00' }}>Ferimentos: {abrigado.ferimento}</Text>
        {abrigado.condicoes.length > 0 ? (
          abrigado.condicoes.map((cond, idx) => <Text key={idx}>• {cond}</Text>)
        ) : (
          <Text>• Sem condições médicas</Text>
        )}
      </View>
    </Pressable>
  );
}
