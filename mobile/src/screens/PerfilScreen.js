import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, ScrollView,
  TextInput, Modal, Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { api } from '../services/api';
import { cores } from '../assets/cores';

export default function PerfilScreen({ route, navigation }) {
  const { utilizador: utilizadorInicial, token } = route.params;
  const [utilizador, setUtilizador] = useState(utilizadorInicial);
  const [marcacoes, setMarcacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [foto, setFoto] = useState(null);

  // Modal editar perfil
  const [modalPerfil, setModalPerfil] = useState(false);
  const [nome, setNome] = useState(utilizadorInicial.nome);
  const [email, setEmail] = useState(utilizadorInicial.email);
  const [telefone, setTelefone] = useState(utilizadorInicial.telefone || '');
  const [guardando, setGuardando] = useState(false);

  // Modal alterar senha
  const [modalSenha, setModalSenha] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [alterando, setAlterando] = useState(false);

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

  const escolherFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });
    if (!resultado.canceled) {
      setFoto(resultado.assets[0].uri);
    }
  };

  const guardarPerfil = async () => {
    if (!nome || !email) {
      Alert.alert('Erro', 'Nome e email são obrigatórios');
      return;
    }
    setGuardando(true);
    try {
      const dados = await api.put('/auth/perfil', { nome, email, telefone }, token);
      if (dados.id) {
        setUtilizador(dados);
        setModalPerfil(false);
        Alert.alert('✅ Sucesso', 'Perfil atualizado!');
      } else {
        Alert.alert('Erro', dados.erro || 'Erro ao atualizar perfil');
      }
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil');
    }
    setGuardando(false);
  };

  const guardarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Alert.alert('Erro', 'Preenche todos os campos');
      return;
    }
    if (novaSenha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }
    if (novaSenha.length < 6) {
      Alert.alert('Erro', 'A nova senha deve ter pelo menos 6 caracteres');
      return;
    }
    setAlterando(true);
    try {
      const dados = await api.put('/auth/senha', { senhaAtual, novaSenha }, token);
      if (dados.mensagem) {
        setModalSenha(false);
        setSenhaAtual('');
        setNovaSenha('');
        setConfirmarSenha('');
        Alert.alert('✅ Sucesso', 'Senha alterada com sucesso!');
      } else {
        Alert.alert('Erro', dados.erro || 'Erro ao alterar senha');
      }
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível alterar a senha');
    }
    setAlterando(false);
  };

  const terminarSessao = () => {
    Alert.alert(
      'Terminar Sessão',
      'Tens a certeza que queres sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => navigation.replace('Login') }
      ]
    );
  };

  const pendentes = marcacoes.filter(m => m.estado === 'pendente').length;
  const canceladas = marcacoes.filter(m => m.estado === 'cancelada').length;

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={cores.branco} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.voltarBotao} onPress={() => navigation.goBack()}>
          <Text style={styles.voltarTexto}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={escolherFoto}>
          {foto ? (
            <Image source={{ uri: foto }} style={styles.avatarGrande} />
          ) : (
            <View style={styles.avatarGrande}>
              <Text style={styles.avatarTexto}>
                {utilizador.nome.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View style={styles.fotoBadge}>
            <Text style={styles.fotoBadgeTexto}>📷</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.nome}>{utilizador.nome}</Text>
        <Text style={styles.email}>{utilizador.email}</Text>
      </View>

      {/* Estatísticas marcações */}
      <Text style={styles.secaoTitulo}>Resumo de Marcações</Text>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumero}>{marcacoes.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumero}>{pendentes}</Text>
          <Text style={styles.statLabel}>Pendentes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumero}>{canceladas}</Text>
          <Text style={styles.statLabel}>Canceladas</Text>
        </View>
      </View>

      {/* Informações */}
      <Text style={styles.secaoTitulo}>Informações da Conta</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoLinha}>
          <Text style={styles.infoLabel}>👤 Nome</Text>
          <Text style={styles.infoValor}>{utilizador.nome}</Text>
        </View>
        <View style={styles.separador} />
        <View style={styles.infoLinha}>
          <Text style={styles.infoLabel}>📧 Email</Text>
          <Text style={styles.infoValor}>{utilizador.email}</Text>
        </View>
        <View style={styles.separador} />
        <View style={styles.infoLinha}>
          <Text style={styles.infoLabel}>📞 Telefone</Text>
          <Text style={styles.infoValor}>{utilizador.telefone || 'Não definido'}</Text>
        </View>
        <View style={styles.separador} />
        <View style={styles.infoLinha}>
          <Text style={styles.infoLabel}>🔑 Tipo</Text>
          <Text style={styles.infoValor}>{utilizador.tipo || 'utilizador'}</Text>
        </View>
      </View>

      {/* Botões de ação */}
      <TouchableOpacity style={styles.botaoAcao} onPress={() => setModalPerfil(true)}>
        <Text style={styles.botaoAcaoTexto}>✏️ Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoAcao} onPress={() => setModalSenha(true)}>
        <Text style={styles.botaoAcaoTexto}>🔒 Alterar Senha</Text>
      </TouchableOpacity>

      {/* Últimas marcações */}
      <Text style={styles.secaoTitulo}>Últimas Marcações</Text>
      {marcacoes.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioTexto}>Sem marcações ainda</Text>
        </View>
      ) : (
        marcacoes.slice(0, 3).map((item) => (
          <View key={item.id} style={styles.marcacaoCard}>
            <View style={styles.marcacaoInfo}>
              <Text style={styles.marcacaoNome}>{item.posto_nome}</Text>
              <Text style={styles.marcacaoData}>
                📅 {new Date(item.data_marcacao).toLocaleDateString('pt-PT')} às {item.hora_marcacao}
              </Text>
            </View>
            <View style={[styles.estado, item.estado === 'pendente' && styles.estadoPendente]}>
              <Text style={styles.estadoTexto}>{item.estado}</Text>
            </View>
          </View>
        ))
      )}

      <TouchableOpacity style={styles.botaoSair} onPress={terminarSessao}>
        <Text style={styles.botaoSairTexto}>🚪 Terminar Sessão</Text>
      </TouchableOpacity>

      <View style={{ height: 32 }} />

      {/* Modal Editar Perfil */}
      <Modal visible={modalPerfil} animationType="slide" transparent>
        <View style={styles.modalFundo}>
          <View style={styles.modal}>
            <Text style={styles.modalTitulo}>Editar Perfil</Text>

            <TextInput style={styles.input} placeholder="Nome" placeholderTextColor={cores.cinza}
              value={nome} onChangeText={setNome} color={cores.branco} />
            <TextInput style={styles.input} placeholder="Email" placeholderTextColor={cores.cinza}
              value={email} onChangeText={setEmail} keyboardType="email-address"
              autoCapitalize="none" color={cores.branco} />
            <TextInput style={styles.input} placeholder="Telefone" placeholderTextColor={cores.cinza}
              value={telefone} onChangeText={setTelefone} keyboardType="phone-pad"
              color={cores.branco} />

            <TouchableOpacity style={styles.botaoModal} onPress={guardarPerfil} disabled={guardando}>
              {guardando
                ? <ActivityIndicator color={cores.branco} />
                : <Text style={styles.botaoModalTexto}>Guardar</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoCancelarModal} onPress={() => setModalPerfil(false)}>
              <Text style={styles.botaoCancelarModalTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Alterar Senha */}
      <Modal visible={modalSenha} animationType="slide" transparent>
        <View style={styles.modalFundo}>
          <View style={styles.modal}>
            <Text style={styles.modalTitulo}>Alterar Senha</Text>

            <TextInput style={styles.input} placeholder="Senha atual" placeholderTextColor={cores.cinza}
              value={senhaAtual} onChangeText={setSenhaAtual} secureTextEntry color={cores.branco} />
            <TextInput style={styles.input} placeholder="Nova senha" placeholderTextColor={cores.cinza}
              value={novaSenha} onChangeText={setNovaSenha} secureTextEntry color={cores.branco} />
            <TextInput style={styles.input} placeholder="Confirmar nova senha" placeholderTextColor={cores.cinza}
              value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry color={cores.branco} />

            <TouchableOpacity style={styles.botaoModal} onPress={guardarSenha} disabled={alterando}>
              {alterando
                ? <ActivityIndicator color={cores.branco} />
                : <Text style={styles.botaoModalTexto}>Alterar</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.botaoCancelarModal} onPress={() => setModalSenha(false)}>
              <Text style={styles.botaoCancelarModalTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: cores.fundo },
  header: {
    backgroundColor: cores.primaria, padding: 24,
    paddingTop: 50, alignItems: 'center', paddingBottom: 32,
  },
  voltarBotao: {
    position: 'absolute', top: 50, left: 24,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: cores.card, justifyContent: 'center',
    alignItems: 'center', borderWidth: 1, borderColor: cores.secundaria,
  },
  voltarTexto: { color: cores.branco, fontSize: 18 },
  avatarGrande: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: cores.destaque, justifyContent: 'center',
    alignItems: 'center', borderWidth: 3, borderColor: cores.cinza,
    marginBottom: 12,
  },
  avatarTexto: { fontSize: 36, fontWeight: 'bold', color: cores.branco },
  fotoBadge: {
    position: 'absolute', bottom: 8, right: -4,
    backgroundColor: cores.secundaria, borderRadius: 12,
    padding: 4,
  },
  fotoBadgeTexto: { fontSize: 14 },
  nome: { fontSize: 22, fontWeight: 'bold', color: cores.branco, marginBottom: 4 },
  email: { fontSize: 13, color: cores.cinza },
  secaoTitulo: {
    fontSize: 12, fontWeight: 'bold', color: cores.cinza,
    paddingHorizontal: 16, marginTop: 20, marginBottom: 8,
    letterSpacing: 1, textTransform: 'uppercase'
  },
  statsContainer: { flexDirection: 'row', paddingHorizontal: 16, gap: 12 },
  statCard: {
    flex: 1, backgroundColor: cores.card, borderRadius: 12,
    padding: 16, alignItems: 'center', borderWidth: 1, borderColor: cores.secundaria,
  },
  statNumero: { fontSize: 24, fontWeight: 'bold', color: cores.branco },
  statLabel: { fontSize: 11, color: cores.cinza, marginTop: 4 },
  infoContainer: {
    backgroundColor: cores.card, marginHorizontal: 16,
    borderRadius: 12, borderWidth: 1, borderColor: cores.secundaria,
    overflow: 'hidden'
  },
  infoLinha: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', padding: 16,
  },
  infoLabel: { color: cores.cinza, fontSize: 14 },
  infoValor: { color: cores.branco, fontSize: 14, fontWeight: '500' },
  separador: { height: 1, backgroundColor: cores.secundaria, marginHorizontal: 16 },
  botaoAcao: {
    backgroundColor: cores.card, marginHorizontal: 16, marginTop: 8,
    borderRadius: 12, padding: 16, borderWidth: 1, borderColor: cores.secundaria,
  },
  botaoAcaoTexto: { color: cores.branco, fontSize: 15, fontWeight: '500' },
  vazio: {
    marginHorizontal: 16, backgroundColor: cores.card,
    borderRadius: 12, padding: 24, alignItems: 'center',
    borderWidth: 1, borderColor: cores.secundaria,
  },
  vazioTexto: { color: cores.cinza, fontSize: 14 },
  marcacaoCard: {
    backgroundColor: cores.card, marginHorizontal: 16,
    borderRadius: 12, padding: 16, marginBottom: 8,
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: cores.secundaria,
  },
  marcacaoInfo: { flex: 1 },
  marcacaoNome: { fontSize: 14, fontWeight: 'bold', color: cores.branco },
  marcacaoData: { fontSize: 12, color: cores.cinza, marginTop: 4 },
  estado: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8, backgroundColor: cores.secundaria,
  },
  estadoPendente: { backgroundColor: '#b45309' },
  estadoTexto: { color: cores.branco, fontSize: 11, fontWeight: 'bold' },
  botaoSair: {
    marginHorizontal: 16, marginTop: 16,
    backgroundColor: '#dc2626', borderRadius: 12,
    padding: 16, alignItems: 'center',
  },
  botaoSairTexto: { color: cores.branco, fontSize: 15, fontWeight: 'bold' },
  modalFundo: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: cores.card, borderTopLeftRadius: 24,
    borderTopRightRadius: 24, padding: 24,
  },
  modalTitulo: {
    fontSize: 20, fontWeight: 'bold', color: cores.branco,
    marginBottom: 20, textAlign: 'center'
  },
  input: {
    backgroundColor: cores.fundo, borderRadius: 10,
    padding: 14, marginBottom: 12, fontSize: 15,
    borderWidth: 1, borderColor: cores.secundaria,
  },
  botaoModal: {
    backgroundColor: cores.secundaria, borderRadius: 10,
    padding: 16, alignItems: 'center', marginTop: 4,
    borderWidth: 1, borderColor: cores.destaque,
  },
  botaoModalTexto: { color: cores.branco, fontSize: 15, fontWeight: 'bold' },
  botaoCancelarModal: { padding: 16, alignItems: 'center' },
  botaoCancelarModalTexto: { color: cores.cinza, fontSize: 14 },
});