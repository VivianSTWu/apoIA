// Este componente será usado para cadastro de novos abrigados com integração à API
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Checkbox } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { criarAbrigado, criarDoenca, login } from '../services/api';

interface AbrigadoFormProps {
  onSave: () => void;
  modo: 'cadastro';
}

export default function AbrigadoForm({ onSave, modo }: AbrigadoFormProps) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [ferimentos, setFerimentos] = useState('Nenhum');
  const [querSerVoluntario, setQuerSerVoluntario] = useState(false);
  const [possuiCondicao, setPossuiCondicao] = useState(false);
  const [habilidades, setHabilidades] = useState<any>({});
  const [doencas, setDoencas] = useState<any>({});
  const [outraCondicaoTexto, setOutraCondicaoTexto] = useState('');

  const toggleHabilidade = (key: string) => {
    setHabilidades((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleDoenca = (key: string) => {
    setDoencas((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const carregarLocal = async () => {
      const localSalvo = await AsyncStorage.getItem('localId');
      if (!localSalvo) {
        Alert.alert('Erro', 'Nenhum local cadastrado. Por favor, inicie pelo menu principal.');
      }
    };
    carregarLocal();
  }, []);

  const handleSubmit = async () => {
    try {
      await login();

      const localId = await AsyncStorage.getItem('localId');
      const token = await AsyncStorage.getItem('token');

      if (!localId || !token) {
        Alert.alert('Erro', 'Local ou token não encontrado. Volte à tela inicial para cadastrar.');
        return;
      }

      const abrigado = await criarAbrigado({
        nome,
        cpf,
        idade: Number(idade),
        peso: Number(peso),
        altura: Number(altura),
        ferimento: ferimentos,
        localId,
      });

      if (querSerVoluntario) {
        const habilidadeIds: string[] = [];
        const mapa: Record<string, string> = {
          prepararRefeicoes: '05fedf76-c9f6-4430-86a9-9cc600eeb872',
          cuidadosMedicos: '45a4c73c-bd30-4d5c-a6f6-59bb58b3c893',
          limpezaAmbientes: '47fedfa5-efd7-4f5c-81de-e2885cee34f8',
          apoioEmocional: '5139576e-1356-4ea8-86f8-56e68a659e68',
        };
        Object.keys(habilidades).forEach((k) => {
          if (habilidades[k] && mapa[k]) habilidadeIds.push(mapa[k]);
        });

        const res = await fetch(`https://apo-ia.azurewebsites.net/voluntario`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ abrigadoId: abrigado.id, habilidadeIds }),
        });

        const text = await res.text();
        console.log('Resposta do servidor (voluntário):', text);
        if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
      }

      if (possuiCondicao) {
        const condicoes: string[] = [];
        Object.entries(doencas).forEach(([k, v]) => {
          if (v && k !== 'outra') condicoes.push(k);
        });

        if (doencas.outra && outraCondicaoTexto.trim()) {
          await criarDoenca({ nome: outraCondicaoTexto, gravidade: 'LEVE' });
          condicoes.push(outraCondicaoTexto);
        }

        const res = await fetch(`https://apo-ia.azurewebsites.net/condicao`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ abrigadoId: abrigado.id, condicoes }),
        });

        const text = await res.text();
        console.log('Resposta do servidor (condicoes):', text);
        if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);
      }

      Alert.alert('Sucesso', 'Abrigado cadastrado com sucesso!');
      onSave();
    } catch (e) {
      console.error(e);
      Alert.alert('Erro', 'Não foi possível cadastrar.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nome completo</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Digite seu nome" />

      <Text style={styles.label}>CPF</Text>
      <TextInput style={styles.input} value={cpf} onChangeText={setCpf} placeholder="Digite seu CPF" keyboardType="numeric" />

      <Text style={styles.label}>Idade</Text>
      <TextInput style={styles.input} value={idade} onChangeText={setIdade} placeholder="Digite sua idade" keyboardType="numeric" />

      <Text style={styles.label}>Peso (kg)</Text>
      <TextInput style={styles.input} value={peso} onChangeText={setPeso} placeholder="Digite seu peso" keyboardType="numeric" />

      <Text style={styles.label}>Altura (m)</Text>
      <TextInput style={styles.input} value={altura} onChangeText={setAltura} placeholder="Digite sua altura" keyboardType="numeric" />

      <Text style={styles.label}>Ferimentos</Text>
      <Picker selectedValue={ferimentos} onValueChange={setFerimentos} style={styles.input}>
        <Picker.Item label="Nenhum" value="Nenhum" />
        <Picker.Item label="Leves" value="Leves" />
        <Picker.Item label="Graves" value="Graves" />
        <Picker.Item label="Muito Graves" value="Muito Graves" />
      </Picker>

      <View style={styles.checkboxLinha}>
        <Checkbox
          status={querSerVoluntario ? 'checked' : 'unchecked'}
          onPress={() => setQuerSerVoluntario(!querSerVoluntario)}
        />
        <Text style={styles.checkboxLabel}>Quero ser voluntário</Text>
      </View>

      {querSerVoluntario && (
        <>
          <Text style={styles.subtitulo}>🍲 Alimentação e Cozinha</Text>
          <Checkbox.Item label="Preparar refeições" status={habilidades.prepararRefeicoes ? 'checked' : 'unchecked'} onPress={() => toggleHabilidade('prepararRefeicoes')} />
          <Checkbox.Item label="Higienizar utensílios e cozinha" status={habilidades.higienizarCozinha ? 'checked' : 'unchecked'} onPress={() => toggleHabilidade('higienizarCozinha')} />

          <Text style={styles.subtitulo}>🏥 Cuidados com a Saúde</Text>
          <Checkbox.Item label="Cuidados médicos" status={habilidades.cuidadosMedicos ? 'checked' : 'unchecked'} onPress={() => toggleHabilidade('cuidadosMedicos')} />
          <Checkbox.Item label="Auxiliar na enfermaria" status={habilidades.auxiliarEnfermaria ? 'checked' : 'unchecked'} onPress={() => toggleHabilidade('auxiliarEnfermaria')} />

          <Text style={styles.subtitulo}>🧠 Apoio Emocional</Text>
          <Checkbox.Item label="Apoio psicológico básico" status={habilidades.apoioEmocional ? 'checked' : 'unchecked'} onPress={() => toggleHabilidade('apoioEmocional')} />
          <Checkbox.Item label="Acolhimento infantil" status={habilidades.acolhimentoInfantil ? 'checked' : 'unchecked'} onPress={() => toggleHabilidade('acolhimentoInfantil')} />

          <Text style={styles.subtitulo}>🧼 Higiene e Saneamento</Text>
          <Checkbox.Item label="Limpeza de ambientes" status={habilidades.limpezaAmbientes ? 'checked' : 'unchecked'} onPress={() => toggleHabilidade('limpezaAmbientes')} />
          <Checkbox.Item label="Organização de kits de higiene" status={habilidades.kitsHigiene ? 'checked' : 'unchecked'} onPress={() => toggleHabilidade('kitsHigiene')} />

          <Text style={styles.subtitulo}>📦 Logística e Organização</Text>
          <Checkbox.Item label="Apoio administrativo" status={habilidades.apoioAdm ? 'checked' : 'unchecked'} onPress={() => toggleHabilidade('apoioAdm')} />
          <Checkbox.Item label="Organizar estoques e doações" status={habilidades.organizacaoEstoques ? 'checked' : 'unchecked'} onPress={() => toggleHabilidade('organizacaoEstoques')} />
          <Checkbox.Item label="Organizar roupas e itens pessoais" status={habilidades.organizacaoRoupas ? 'checked' : 'unchecked'} onPress={() => toggleHabilidade('organizacaoRoupas')} />
          <Checkbox.Item label="Auxiliar em tarefas braçais (carregar e movimentar itens)" status={habilidades.trabalhoBracal ? 'checked' : 'unchecked'} onPress={() => toggleHabilidade('trabalhoBracal')} />
        </>
      )}

      <View style={styles.checkboxLinha}>
        <Checkbox
          status={possuiCondicao ? 'checked' : 'unchecked'}
          onPress={() => setPossuiCondicao(!possuiCondicao)}
        />
        <Text style={styles.checkboxLabel}>
          Possuo alguma condição médica que requer atenção especial
        </Text>
      </View>

      {possuiCondicao && (
        <>
          <Text style={styles.subtitulo}>🏥 Condições médicas específicas</Text>
          <Checkbox.Item label="Diabetes" status={doencas.diabetes ? 'checked' : 'unchecked'} onPress={() => toggleDoenca('diabetes')} />
          <Checkbox.Item label="Hipertensão (pressão alta)" status={doencas.hipertensao ? 'checked' : 'unchecked'} onPress={() => toggleDoenca('hipertensao')} />
          <Checkbox.Item label="Asma ou problema respiratório" status={doencas.respiratoria ? 'checked' : 'unchecked'} onPress={() => toggleDoenca('respiratoria')} />
          <Checkbox.Item label="Epilepsia" status={doencas.epilepsia ? 'checked' : 'unchecked'} onPress={() => toggleDoenca('epilepsia')} />
          <Checkbox.Item label="Doença cardíaca" status={doencas.cardiaca ? 'checked' : 'unchecked'} onPress={() => toggleDoenca('cardiaca')} />
          <Checkbox.Item label="Deficiência motora ou mobilidade reduzida" status={doencas.mobilidade ? 'checked' : 'unchecked'} onPress={() => toggleDoenca('mobilidade')} />
          <Checkbox.Item label="Transtorno mental ou emocional" status={doencas.mental ? 'checked' : 'unchecked'} onPress={() => toggleDoenca('mental')} />
          <Checkbox.Item label="Transtorno do espectro autista (TEA)" status={doencas.tea ? 'checked' : 'unchecked'} onPress={() => toggleDoenca('tea')} />
          <Checkbox.Item label="HIV/AIDS" status={doencas.hiv ? 'checked' : 'unchecked'} onPress={() => toggleDoenca('hiv')} />
          <Checkbox.Item label="Outra condição relevante" status={doencas.outra ? 'checked' : 'unchecked'} onPress={() => toggleDoenca('outra')} />
          {doencas.outra && (
            <TextInput
              style={styles.input}
              placeholder="Descreva sua condição"
              value={outraCondicaoTexto}
              onChangeText={setOutraCondicaoTexto}
              multiline
            />
          )}
        </>
      )}

      <Button title={modo === 'cadastro' ? 'Cadastrar' : 'Salvar'} onPress={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },
  checkboxLinha: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  checkboxLabel: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
    paddingTop: 7,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
});
