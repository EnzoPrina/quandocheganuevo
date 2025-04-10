// app/index.tsx
import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../src/context/AuthContext';
import { useRouter } from 'expo-router';
import { auth } from '../src/data/firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(true); // Controla se mostra o onboarding
  const { user, login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  // Redireção única baseada em onAuthStateChanged
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('onAuthStateChanged:', currentUser);
      if (currentUser) {
        // Redireciona para o dashboard assim que autenticado
        router.replace('/main/dashboard');
      } else {
        // Se não houver usuário, você pode redirecionar para a tela de login ou mostrar uma mensagem.
        console.log("Não há usuário autenticado.");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userResult = userCredential.user; // Usuario de la respuesta de Firebase

      if (userResult) {
        // Si el login es exitoso, mostramos el nombre en la alerta
        Alert.alert('Olá!', `Bem-vindo ao QuandoChega` , [{ text: 'Obrigado' }], { cancelable: false });
        router.replace('/main/dashboard');
      } else {
        setError('Credenciais inválidas.');
      }
    } catch (err: any) {
      console.error('Erro no login:', err);
      setError('Ocorreu um erro durante o login.');
      if (err.code === 'auth/user-not-found') {
        setError('Usuário não encontrado.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Senha incorreta.');
      } else {
        setError('Ocorreu um erro desconhecido.');
      }
    }
  };
  
  const goToRegister = () => {
    router.push('/register');
  };

  if (showOnboarding) {
    return (
      <OnboardingScreen onFinish={() => setShowOnboarding(false)} />
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <Image
            source={require('../assets/images/LogoMano.png')}
            style={styles.logo}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="white"
            onChangeText={setEmail}
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Senha"
              secureTextEntry={!showPassword}
              placeholderTextColor="white"
              onChangeText={setPassword}
              value={password}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.icon}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={28}
                color="white"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar Sessão</Text>
          </TouchableOpacity>
          {error && <Text style={styles.error}>{error}</Text>}
          <Text style={styles.registerText} onPress={goToRegister}>
            Não tenho conta, registar-me.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function OnboardingScreen({ onFinish }) {
  const slides = [
    {
      image: require('../assets/images/Principales-09.png'),
      message: 'Todos a olhar para o telemóvel... mas tu, pelo menos, sabes quando chega o teu autocarro. Orgulho de utilizador do QuandoChega! 😎!',
    },
    {
      image: require('../assets/images/Principales-10.png'),
      message: "Esperar o autocarro ou carregar o stress? Melhor deixar que o QuandoChega o faça por ti. As tuas costas vão agradecer! 💪😂",
    },
    {
      image: require('../assets/images/Principales-11.png'),
      message: "Ela tem tudo controlado: cão pronto, autocarro perto e QuandoChega no bolso. Tu também podes ser assim tão pro! 🐶🚌",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      onFinish();
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  return (
    <View style={styles.onboardingContainer}>
      <Image source={slides[currentSlide].image} style={styles.onboardingImage} />
      <Text style={styles.onboardingText}>{slides[currentSlide].message}</Text>
      <TouchableOpacity style={styles.onboardingButton} onPress={handleNext}>
        <Text style={styles.onboardingButtonText}>
          {currentSlide === slides.length - 1 ? 'Começar' : 'Seguinte'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202020',
  },
  logo: {
    width: 350,
    height: 350,
    marginBottom: 30,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#5cb32b',
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 15,
    padding: 10,
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
    top: '35%',
    marginBottom: 15,
    transform: [{ translateY: -12 }],
  },
  error: {
    color: 'white',
    marginTop: 10,
  },
  registerText: {
    color: 'white',
    marginTop: 15,
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#5cb32b',
    width: '100%',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#5cb32b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#202020',
    fontSize: 16,
    fontWeight: 'bold',
  },
  onboardingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#202020',
  },
  onboardingImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  onboardingText: {
    width: '90%',
    color: 'white',
    fontSize: 17,
    textAlign: 'center',
    marginBottom: 20,
  },
  onboardingButton: {
    backgroundColor: '#5cb32b',
    width: '90%',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  onboardingButtonText: {
    color: '#202020',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
