import React from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import AbrigadoForm from '../../components/AbrigadoForm';

export default function CadastroAbrigado() {
  const router = useRouter();

  const handleSave = async (data: any) => {
    try {
      await addDoc(collection(db, 'abrigados'), data);
      Alert.alert('Sucesso', 'Abrigado cadastrado com sucesso.');
      router.back();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar o abrigado.');
    }
  };

  return <AbrigadoForm onSave={handleSave} modo="cadastro" />;
}
