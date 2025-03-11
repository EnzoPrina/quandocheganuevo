// app/_layout.tsx
import React, { useContext } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import { AuthProvider, AuthContext } from '../src/context/AuthContext';
import { FavoriteStopsProvider } from '../src/context/FavoriteStopsContext';
import { FirebaseProvider } from '../src/context/FirebaseContext';

export default function Layout() {
  return (
    <FirebaseProvider>
      <AuthProvider>
        <FavoriteStopsProvider>
          <View style={{ flex: 1 }}>
            {/* Siempre se monta el Slot para tener el contenedor de navegación */}
            <Slot />
            {/* Overlay de carga mientras se valida el estado de autenticación */}
            <AuthLoadingOverlay />
          </View>
        </FavoriteStopsProvider>
      </AuthProvider>
    </FirebaseProvider>
  );
}

const AuthLoadingOverlay = () => {
  const { loading } = useContext(AuthContext);
  if (!loading) return null;
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#5cb32b" />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
});
