import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { api } from '../services/api';
import { cores } from '../assets/cores';

export default function MarcacoesScreen({ route, navigation }) {
  const { posto, servico, token } = route.params;
  const [marcacoes, setMarcacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [criando, setCriando] = useState(false);

  const [mostrarData, setMostrarData] = useState(false);
  const [mostrarHora, setMostrarHora] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [horaSelecionada, setHoraSelecionada] = useState(new Date());

  useEffect(() => {
    carregarMarcacoes();
  }, []);

  const carregarMarcacoes = async () => {
    try {
      const dados = await api.get('/marcacoes', token);
      setMarcacoes(dados);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const criarMarcacao = async () => {
    setCriando(true);
    try {
      const data = dataSelecionada.toISOString().split('T')[0];
      const hora = horaSelecionada.toTimeString().split(' ')[0].slice(0, 5);

      const resposta = await api.post('/marcacoes', {
        posto_id: posto.id,
        data_marcacao: data,
        hora_marcacao: hora
      }, token);

      if (resposta.id) {
        Alert.alert('✅ Sucesso', `Marcação criada para ${data} às ${hora}`);
        carregarMarcacoes();
      } else {
        Alert.alert('Erro', resposta.erro || 'Erro ao criar marcação');
      }
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível criar a marcação');
    }
    setCriando(false);
  };

  const cancelarMarcacao = (id) => {
    Alert.alert(
      'Cancelar Marcação',
      'Tens a certeza que queres cancelar esta marcação?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.post(`/marcacoes/${id}/cancelar`, {}, token);
              carregarMarcacoes();
            } catch (err) {
              Alert.alert('Erro', 'Não foi possível cancelar a marcação');
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={cores.branco} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.voltarBotao} onPress={() => navigation.goBack()}>
          <Text style={styles.voltarTexto}>←</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Marcações</Text>
        <Text style={styles.subtitulo}>{posto.nome}</Text>
      </View>

      {/* Seletor de data e hora */}
      <View style={styles.seletorContainer}>
        <TouchableOpacity style={styles.seletorBotao} onPress={() => setMostrarData(true)}>
          <Text style={styles.seletorLabel}>📅 Data</Text>
          <Text style={styles.seletorValor}>{dataSelecionada.toLocaleDateString('pt-PT')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.seletorBotao} onPress={() => setMostrarHora(true)}>
          <Text style={styles.seletorLabel}>🕐 Hora</Text>
          <Text style={styles.seletorValor}>{horaSelecionada.toTimeString().slice(0, 5)}</Text>
        </TouchableOpacity>
      </View>

      {mostrarData && (
        <DateTimePicker
          value={dataSelecionada}
          mode="date"
          minimumDate={new Date()}
          onChange={(event, date) => {
            setMostrarData(false);
            if (date) setDataSelecionada(date);
          }}
        />
      )}

      {mostrarHora && (
        <DateTimePicker
          value={horaSelecionada}
          mode="time"
          is24Hour={true}
          onChange={(event, hora) => {
            setMostrarHora(false);
            if (hora) setHoraSelecionada(hora);
          }}
        />
      )}

      <TouchableOpacity
        style={styles.botaoMarcar}
        onPress={criarMarcacao}
        disabled={criando}
      >
        {criando
          ? <ActivityIndicator color={cores.branco} />
          : <Text style={styles.botaoMarcarTexto}>📅 Confirmar Marcação</Text>
        }
      </TouchableOpacity>

      <FlatList
        data={marcacoes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.vazio}>Sem marcações ainda</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.cardNome}>{item.posto_nome}</Text>
              <Text style={styles.cardData}>
                📅 {new Date(item.data_marcacao).toLocaleDateString('pt-PT')} às {item.hora_marcacao}
              </Text>
            </View>
            <View style={styles.cardDireita}>
              <View style={[styles.estado, item.estado === 'pendente' && styles.estadoPendente]}>
                <Text style={styles.estadoTexto}>{item.estado}</Text>
              </View>
              {item.estado === 'pendente' && (
                <TouchableOpacity
                  style={styles.cancelarBotao}
                  onPress={() => cancelarMarcacao(item.id)}
                >
                  <Text style={styles.cancelarTexto}>Cancelar</Text>
                  </TouchableOpacity>
                )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: cores.fundo },
  header: {
    backgroundColor: cores.primaria,
    padding: 24,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: cores.destaque
  },
  voltarBotao: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: cores.card, justifyContent: 'center',
    alignItems: 'center', marginBottom: 12,
    borderWidth: 1, borderColor: cores.secundaria,
  },
  voltarTexto: { color: cores.branco, fontSize: 18 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: cores.branco },
  subtitulo: { fontSize: 13, color: cores.cinza, marginTop: 4 },
  seletorContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12
  },
  seletorBotao: {
    flex: 1,
    backgroundColor: cores.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: cores.secundaria,
    alignItems: 'center'
  },
  seletorLabel: { color: cores.cinza, fontSize: 12, marginBottom: 4 },
  seletorValor: { color: cores.branco, fontSize: 15, fontWeight: 'bold' },
  botaoMarcar: {
    backgroundColor: cores.secundaria,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: cores.destaque
  },
  botaoMarcarTexto: { color: cores.branco, fontSize: 15, fontWeight: 'bold', letterSpacing: 1 },
  lista: { padding: 16 },
  vazio: { color: cores.cinza, textAlign: 'center', marginTop: 40, fontSize: 16 },
  card: {
    backgroundColor: cores.card, borderRadius: 12, padding: 16,
    marginBottom: 12, flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: cores.secundaria
  },
  cardInfo: { flex: 1 },
  cardNome: { fontSize: 15, fontWeight: 'bold', color: cores.branco },
  cardData: { fontSize: 13, color: cores.cinza, marginTop: 4 },
  cardDireita: { alignItems: 'flex-end', gap: 8 },
  estado: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8, backgroundColor: cores.secundaria
  },
  estadoPendente: { backgroundColor: '#b45309' },
  estadoTexto: { color: cores.branco, fontSize: 11, fontWeight: 'bold' },
  cancelarBotao: {
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 8,
  backgroundColor: '#dc2626',
  marginTop: 4,
},
cancelarTexto: {
  color: cores.branco,
  fontSize: 12,
  fontWeight: 'bold',
  letterSpacing: 0.5
}
});