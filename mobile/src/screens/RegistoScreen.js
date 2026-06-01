import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { api } from '../services/api';
import { cores } from '../assets/cores';

export default function RegistoScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegistar = async () => {
    if (!nome || !email || !telefone || !senha || !confirmarSenha) {
  Alert.alert('Erro', 'Preenche todos os campos!');
  return;
}
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres!');
      return;
    }

    setLoading(true);
    try {
      const resposta = await api.post('/auth/registar', { nome, email, telefone, senha });
      if (resposta.token) {
        navigation.replace('Home', {
          utilizador: resposta.utilizador,
          token: resposta.token
        });
      } else {
        Alert.alert('Erro', resposta.erro || 'Erro ao criar conta');
      }
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível ligar ao servidor');
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Fundo decorativo */}
        <View style={styles.fundoTopo}>
          <View style={styles.circulo1} />
          <View style={styles.circulo2} />
          <View style={styles.circulo3} />
        </View>

        {/* Logo */}
        <View style={styles.logoArea}>
          <Text style={styles.titulo}>MGo</Text>
          <Text style={styles.subtitulo}>SERVIÇOS PÚBLICOS DE ANGOLA</Text>
        </View>

        {/* Formulário */}
        <View style={styles.formulario}>
          <Text style={styles.formTitulo}>Criar Conta</Text>
          <Text style={styles.formSubtitulo}>Regista-te para começar</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            placeholderTextColor={cores.cinza}
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
            color={cores.branco}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={cores.cinza}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            color={cores.branco}
          />

          <TextInput
            style={styles.input}
            placeholder="Número de telefone"
            placeholderTextColor={cores.cinza}
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
            color={cores.branco}
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor={cores.cinza}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            color={cores.branco}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirmar senha"
            placeholderTextColor={cores.cinza}
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
            color={cores.branco}
          />

          <TouchableOpacity style={styles.botao} onPress={handleRegistar} disabled={loading}>
            {loading ? (
              <ActivityIndicator color={cores.branco} />
            ) : (
              <Text style={styles.botaoTexto}>CRIAR CONTA</Text>
            )}
          </TouchableOpacity>

          <View style={styles.separador}>
            <View style={styles.linha} />
            <Text style={styles.separadorTexto}>ou</Text>
            <View style={styles.linha} />
          </View>

          <TouchableOpacity style={styles.botaoSecundario} onPress={() => navigation.goBack()}>
            <Text style={styles.botaoSecundarioTexto}>JÁ TENHO CONTA</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  scroll: { flexGrow: 1 },
  fundoTopo: {
    position: 'absolute', top: 0, left: 0, right: 0,
    height: 350, overflow: 'hidden',
  },
  circulo1: {
    position: 'absolute', width: 300, height: 300,
    borderRadius: 150, backgroundColor: cores.secundaria,
    top: -100, left: -80, opacity: 0.5,
  },
  circulo2: {
    position: 'absolute', width: 200, height: 200,
    borderRadius: 100, backgroundColor: cores.destaque,
    top: -50, right: -50, opacity: 0.4,
  },
  circulo3: {
    position: 'absolute', width: 150, height: 150,
    borderRadius: 75, backgroundColor: cores.primaria,
    top: 150, left: 100, opacity: 0.6,
  },
  logoArea: { alignItems: 'center', paddingTop: 100, paddingBottom: 40 },
  titulo: { fontSize: 72, fontWeight: 'bold', color: cores.branco, letterSpacing: 10 },
  subtitulo: { fontSize: 11, color: cores.cinza, letterSpacing: 3, marginTop: 4 },
  formulario: {
    flex: 1, backgroundColor: cores.card,
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 32, marginTop: 20,
  },
  formTitulo: { fontSize: 24, fontWeight: 'bold', color: cores.branco, marginBottom: 4 },
  formSubtitulo: { fontSize: 14, color: cores.cinza, marginBottom: 24 },
  input: {
    backgroundColor: cores.fundo, borderRadius: 10,
    padding: 16, marginBottom: 16, fontSize: 16,
    borderWidth: 1, borderColor: cores.secundaria,
  },
  botao: {
    backgroundColor: cores.secundaria, borderRadius: 10,
    padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: cores.destaque,
  },
  botaoTexto: { color: cores.branco, fontSize: 15, fontWeight: 'bold', letterSpacing: 3 },
  separador: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  linha: { flex: 1, height: 1, backgroundColor: cores.secundaria },
  separadorTexto: { color: cores.cinza, marginHorizontal: 12, fontSize: 13 },
  botaoSecundario: {
    borderRadius: 10, padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: cores.secundaria,
  },
  botaoSecundarioTexto: { color: cores.cinza, fontSize: 15, fontWeight: 'bold', letterSpacing: 3 },
});