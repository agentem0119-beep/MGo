import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from 'react-native';
import { api } from '../services/api';
import { cores } from '../assets/cores';

export default function PostosScreen({ route, navigation }) {
  const { servico, token } = route.params;
  const [postos, setPostos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPostos();
  }, []);

  const carregarPostos = async () => {
    try {
      const dados = await api.get(`/postos?servico_id=${servico.id}`, token);
      console.log('Postos:', JSON.stringify(dados)); // 👈
      setPostos(Array.isArray(dados) ? dados : []);
    } catch (err) {
      console.error('Erro postos:', err);
    }
    setLoading(false);
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
        <Text style={styles.titulo}>{servico.nome}</Text>
        <Text style={styles.subtitulo}>{servico.descricao}</Text>
      </View>

      <FlatList
        data={postos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhum posto disponível</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => servico.permite_marcacao
              ? navigation.navigate('Marcacoes', { posto: item, servico, token })
              : null
            }
          >
            <View style={styles.cardInfo}>
              <Text style={styles.cardNome}>{item.nome}</Text>
              <Text style={styles.cardDesc}>{item.endereco}</Text>
              {item.telefone && (
                <Text style={styles.cardTel}>📞 {item.telefone}</Text>
              )}
            </View>
            <View style={styles.cardDireita}>
              {servico.permite_marcacao && (
                <Text style={styles.badge}>📅 Marcar</Text>
              )}
              <Text style={styles.seta}>→</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.fundo
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: cores.fundo
  },
  header: {
    backgroundColor: cores.primaria,
    padding: 24,
    paddingTop: 50,
    borderBottomWidth: 1,
    borderBottomColor: cores.destaque
  },
  voltarBotao: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: cores.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: cores.secundaria,
  },
  voltarTexto: {
    color: cores.branco,
    fontSize: 18,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: cores.branco
  },
  subtitulo: {
    fontSize: 13,
    color: cores.cinza,
    marginTop: 4
  },
  lista: {
    padding: 16
  },
  vazio: {
    color: cores.cinza,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16
  },
  card: {
    backgroundColor: cores.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: cores.secundaria
  },
  cardInfo: {
    flex: 1
  },
  cardNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: cores.branco
  },
  cardDesc: {
    fontSize: 13,
    color: cores.cinza,
    marginTop: 4
  },
  cardTel: {
    fontSize: 12,
    color: cores.cinza,
    marginTop: 4
  },
  cardDireita: {
    alignItems: 'flex-end'
  },
  badge: {
    fontSize: 11,
    color: cores.cinza,
    marginBottom: 4
  },
  seta: {
    fontSize: 18,
    color: cores.cinza
  },
});