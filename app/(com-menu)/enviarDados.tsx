// app/enviar-dados.tsx
import { useEffect } from 'react';
import { View, Button, Alert } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useRouter } from 'expo-router';

export default function EnviarDados() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.replace('/login');
    });
    return unsubscribe;
  }, []);

  const enviarDados = () => {
    // Aqui envia os dados (ex: via fetch)
    Alert.alert('Dados enviados com sucesso!');
  };

  return (
    <View style={{ padding: 20 }}>
      <Button title="Enviar meus dados" onPress={enviarDados} />
    </View>
  );
}
