import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Image, TouchableOpacity, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { AuthViewModel } from '../src/viewmodels/AuthViewModel';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [nome, setNome] = useState('');
  const [apelido, setApelido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleRegister = async () => {

    if (!nome || !apelido || !email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    if (password.length < 6) {
      setError('A palavra-passe deve ter pelo menos 6 caracteres.');
      return;
    }

    // Asegurándonos de que no haya valores indefinidos
    const userData = {
      nome: nome.trim(),
      apelido: apelido.trim(),
      email: email.trim(),
      password: password.trim()
    };

    if (!userData.nome || !userData.apelido || !userData.email || !userData.password) {
      setError('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const user = await AuthViewModel.register(userData.email, userData.password);

    if (user) {
      setSuccess(`Registo bem-sucedido para ${user.email}`);
      setError('');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } else {
      setError('Erro ao registar o utilizador.');
      setSuccess('');
    }
  };

  const goToLogin = () => {
    router.push('/');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Image source={require('../assets/images/LogoMano.png')} style={styles.logo} />
          
          <Text style={styles.motivationalText}>
            Está a um passo de ficar mais perto do seu autocarro!
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor="white"
            onChangeText={setNome}
            value={nome}
          />

          <TextInput
            style={styles.input}
            placeholder="Apelido"
            placeholderTextColor="white"
            onChangeText={setApelido}
            value={apelido}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="white"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Palavra-passe"
              secureTextEntry={!showPassword}
              placeholderTextColor="white"
              onChangeText={setPassword}
              value={password}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.icon}>
              <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="white" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registar</Text>
          </TouchableOpacity>

          {success ? <Text style={styles.success}>{success}</Text> : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity onPress={goToLogin}>
            <Text style={styles.loginText}>Já tenho uma conta, iniciar sessão</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202020',
  },
  inner: {
    padding: 20,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  motivationalText: {
    color: '#5cb32b',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    fontStyle: 'italic',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#5cb32b',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    color: 'white',
  },
  passwordContainer: {
    width: '100%',
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: '38%',
    transform: [{ translateY: -12 }],
  },
  button: {
    backgroundColor: '#5cb32b',
    width: '100%',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#5cb32b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#202020',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: '#ff4444',
    marginTop: 10,
    textAlign: 'center',
  },
  success: {
    color: '#00C851',
    marginTop: 10,
    textAlign: 'center',
  },
  loginText: {
    color: 'white',
    marginTop: 15,
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});
