import { View, StyleSheet } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function MenuLayout() {
  const router = useRouter();
  const segments = useSegments();

  const isActive = (route: string) =>
    segments[segments.length - 1] === route;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Slot />
      </View>
      <View style={styles.menu}>
        <TouchableOpacity onPress={() => router.push('/(com-menu)/cadastroAbrigado')}>
          <Ionicons
            name="person-add-outline"
            size={26}
            color={isActive('cadastroAbrigado') ? '#007AFF' : '#888'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(com-menu)/listaAbrigados')}>
          <Ionicons
            name="list-outline"
            size={26}
            color={isActive('listaAbrigados') ? '#007AFF' : '#888'}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(com-menu)/enviarDados')}>
          <Ionicons
            name="cloud-upload-outline"
            size={26}
            color={isActive('enviarDados') ? '#007AFF' : '#888'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: 60,
  },
  menu: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
});
