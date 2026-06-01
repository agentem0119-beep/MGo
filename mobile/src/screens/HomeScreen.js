import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView
} from 'react-native';
import { api } from '../services/api';
import { cores } from '../assets/cores';

export default function HomeScreen({ route, navigation }) {
  const { utilizador, token } = route.params;
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    try {
      const dados = await api.get('/categorias', token);
      setCategorias(dados);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const icones = {
    health: '🏥',
    justice: '⚖️',
    education: '🎓',
    finance: '💰',
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={cores.branco} />
      </View>
    );
  }

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.fundoCirculo1} />
        <View style={styles.fundoCirculo2} />
        <View style={styles.headerConteudo}>
          <View>
            <Text style={styles.saudacao}>{saudacao},</Text>
            <Text style={styles.nome}>{utilizador.nome.split(' ')[0]} 👋</Text>
          </View>
          <TouchableOpacity
            style={styles.avatar}
            onPress={() => navigation.navigate('Perfil', { utilizador, token })}
          >
            <Text style={styles.avatarTexto}>
              {utilizador.nome.charAt(0).toUpperCase()}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Barra de pesquisa decorativa */}
        <TouchableOpacity style={styles.pesquisa}>
          <Text style={styles.pesquisaTexto}>🔍  Pesquisar serviço...</Text>
        </TouchableOpacity>
      </View>

      {/* Estatísticas rápidas */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumero}>43</Text>
          <Text style={styles.statLabel}>Serviços</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumero}>21</Text>
          <Text style={styles.statLabel}>Províncias</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumero}>4</Text>
          <Text style={styles.statLabel}>Categorias</Text>
        </View>
      </View>

      {/* Título categorias */}
      <Text style={styles.secaoTitulo}>Categorias de Serviços</Text>

      {/* Grid de categorias */}
      <View style={styles.grid}>
        {categorias.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => navigation.navigate('Servicos', { categoria: item, token })}
          >
            <Text style={styles.icone}>{icones[item.icone] || '📋'}</Text>
            <Text style={styles.cardNome}>{item.nome}</Text>
            <Text style={styles.cardDesc} numberOfLines={2}>{item.descricao}</Text>
            <Text style={styles.cardSeta}>Ver serviços →</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Aviso */}
      <View style={styles.aviso}>
        <Text style={styles.avisoTexto}>
          🔔 Alguns serviços requerem autenticação adicional para acesso a dados pessoais.
        </Text>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: cores.fundo },
  header: {
    backgroundColor: cores.primaria,
    padding: 24,
    paddingTop: 50,
    paddingBottom: 32,
    overflow: 'hidden',
  },
  fundoCirculo1: {
    position: 'absolute', width: 200, height: 200,
    borderRadius: 100, backgroundColor: cores.secundaria,
    top: -60, right: -40, opacity: 0.5,
  },
  fundoCirculo2: {
    position: 'absolute', width: 120, height: 120,
    borderRadius: 60, backgroundColor: cores.destaque,
    bottom: -30, left: 40, opacity: 0.3,
  },
  headerConteudo: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  saudacao: { fontSize: 14, color: cores.cinza, letterSpacing: 1 },
  nome: { fontSize: 24, fontWeight: 'bold', color: cores.branco, marginTop: 2 },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: cores.destaque, justifyContent: 'center',
    alignItems: 'center', borderWidth: 2, borderColor: cores.cinza,
  },
  avatarTexto: { fontSize: 20, fontWeight: 'bold', color: cores.branco },
  pesquisa: {
    backgroundColor: cores.card, borderRadius: 12,
    padding: 14, borderWidth: 1, borderColor: cores.secundaria,
  },
  pesquisaTexto: { color: cores.cinza, fontSize: 14 },
  statsContainer: { flexDirection: 'row', padding: 16, gap: 12 },
  statCard: {
    flex: 1, backgroundColor: cores.card, borderRadius: 12,
    padding: 16, alignItems: 'center', borderWidth: 1, borderColor: cores.secundaria,
  },
  statNumero: { fontSize: 24, fontWeight: 'bold', color: cores.branco },
  statLabel: { fontSize: 11, color: cores.cinza, marginTop: 4 },
  secaoTitulo: {
    fontSize: 16, fontWeight: 'bold', color: cores.branco,
    paddingHorizontal: 16, marginBottom: 12, letterSpacing: 1,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  card: {
    width: '46%', backgroundColor: cores.card, borderRadius: 16,
    padding: 16, margin: '2%', borderWidth: 1, borderColor: cores.secundaria,
  },
  icone: { fontSize: 36, marginBottom: 8 },
  cardNome: { fontSize: 15, fontWeight: 'bold', color: cores.branco, marginBottom: 4 },
  cardDesc: { fontSize: 11, color: cores.cinza, marginBottom: 12, lineHeight: 16 },
  cardSeta: {
    fontSize: 12, color: cores.cinza,
    borderTopWidth: 1, borderTopColor: cores.secundaria, paddingTop: 8,
  },
  aviso: {
    margin: 16, backgroundColor: cores.card, borderRadius: 12,
    padding: 16, borderWidth: 1, borderColor: cores.secundaria,
  },
  avisoTexto: { color: cores.cinza, fontSize: 12, lineHeight: 18 },
});