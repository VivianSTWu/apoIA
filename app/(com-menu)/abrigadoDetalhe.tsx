import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import AbrigadoForm from '../../components/AbrigadoForm';

export default function AbrigadoDetalhe() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [abrigado, setAbrigado] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'abrigados', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAbrigado({ ...docSnap.data(), id: docSnap.id });
      } else {
        Alert.alert('Erro', 'Abrigado não encontrado.');
        router.back();
      }
    };
    fetchData();
  }, [id]);

  const handleSave = async (data: any) => {
    try {
      await updateDoc(doc(db, 'abrigados', id), data);
      Alert.alert('Sucesso', 'Dados atualizados com sucesso.');
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar os dados.');
    }
  };

  const handleDelete = () => {
    Alert.alert('Confirmar Exclusão', 'Deseja excluir este abrigado?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive', onPress: async () => {
          try {
            await deleteDoc(doc(db, 'abrigados', id));
            Alert.alert('Excluído', 'Abrigado removido com sucesso.');
            router.back();
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível excluir.');
          }
        },
      },
    ]);
  };

  if (!abrigado) return null;

  return <AbrigadoForm initialData={abrigado} onSave={handleSave} onDelete={handleDelete} modo="edicao" />;
}
