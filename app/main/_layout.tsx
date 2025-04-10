import { Tabs } from 'expo-router';
import { useColorScheme, StyleSheet, Image, TouchableOpacity, View, Modal, Text } from 'react-native';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { AuthViewModel } from '../../src/viewmodels/AuthViewModel';

export default function MainLayout() {
  const colorScheme = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await AuthViewModel.logout();
    setModalVisible(false);
    router.push('/');
  };

  return (
    <>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarStyle: [
            styles.tabBar,
            {                
              borderColor: colorScheme === 'dark' ? DarkTheme.colors.card : DefaultTheme.colors.card,
              backgroundColor: colorScheme === 'dark' ? DarkTheme.colors.card : DefaultTheme.colors.card,
            },
          ],
          tabBarShowLabel: false,
          tabBarActiveTintColor: '#5cb32b',
          tabBarInactiveTintColor: colorScheme === 'dark' ? '#888' : '#555',
          tabBarIcon: ({ color, size }) => {
            let iconName: string;
            switch (route.name) {
              case 'dashboard':
                iconName = 'home';
                break;
              case 'lineasView':
                iconName = 'bus';
                break;
              case 'mapView':
                iconName = 'map';
                break;
              default:
                iconName = 'question-circle';
                break;
            }
            const iconSize = 28;
            return (
              <View style={[styles.iconContainer, route.name === 'mapView' && styles.mapIconWrapper]}>
                <FontAwesome name={iconName} size={iconSize} color={route.name === 'mapView' ? 'white' : color} />
              </View>
            );
          },
          headerTransparent: true,
          headerTitle: () => (
            <Image
              source={
                colorScheme === 'dark'
                  ? require('../../assets/images/Logo.png')
                  : require('../../assets/images/LogoVerde.png')
              }
              style={styles.logo}
              resizeMode="contain"
            />
          ),
          headerTitleAlign: 'center',
          headerLeft: () => (
            <TouchableOpacity style={styles.iconButton} onPress={() => setInfoModalVisible(true)}>
              <FontAwesome 
                name="info-circle" 
                size={28} 
                color={colorScheme === 'dark' ? 'white' : '#5cb32b'} 
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={styles.iconButton} onPress={() => setModalVisible(true)}>
              <FontAwesome 
                name="power-off" 
                size={28} 
                color={colorScheme === 'dark' ? 'white' : '#5cb32b'} 
              />
            </TouchableOpacity>
          ),
        })}
      >
        <Tabs.Screen name="dashboard" options={{ title: '' }} />
        <Tabs.Screen name="mapView" options={{ title: '' }} />
        <Tabs.Screen name="lineasView" options={{ title: '' }} />
      </Tabs>

      {/* Modal de Informação */}
      <Modal
        visible={infoModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setInfoModalVisible(false)}
            >
              <FontAwesome name="times" size={24} color="white" />
            </TouchableOpacity>
            <Image
              source={require('../../assets/images/cartao.png')}
              style={styles.modalImage}
              resizeMode="contain"
            />
            <Text style={styles.modalText}>Um cartão uma cidade.</Text>
            <Text style={styles.modalSubText}>
              Acesso a experiências e serviços do nosso município num cartão único e gratuito.
            </Text>
            <Text style={styles.modalSubText}>
              Esta aplicação não é oficial do Município de Bragança, mas procura ajudar o cidadão.
            </Text>
          </View>
        </View>
      </Modal>

      {/* Modal de Encerrar Sessão */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image
              source={require('../../assets/images/CerrarSesion.png')}
              style={styles.logoutImage}
              resizeMode="contain"
            />
            <Text style={styles.modalText}>
              Tem a certeza que quer terminar a sessão?
            </Text>
            <Text style={styles.modalSubText}>
              Ao sair, perderá o acesso a funcionalidades exclusivas e as suas preferências serão
              reiniciadas. Reconsidere e continue a desfrutar da nossa aplicação!
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#5cb32b' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#d6130c' }]}
                onPress={handleLogout}
              >
                <Text style={styles.modalButtonText}>Terminar sessão</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapIconWrapper: {
    backgroundColor: '#5cb32b',
    padding: 10,
    borderRadius: 30,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    marginLeft: 30,
    marginRight: 30,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    position: 'absolute',
    left: 10,
    right: 10,
    bottom: 30,
    height: 60,
    paddingTop: 5,
  },
  logo: {
    width: 180,
    height: 180,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    position: 'relative',
    marginLeft: 20,
    marginRight: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#202020',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalImage: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  logoutImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  modalText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalSubText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  fullWidthButton: {
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 5,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
    padding: 5,
  },
});