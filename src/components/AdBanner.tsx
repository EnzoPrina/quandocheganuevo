// src/components/AdBanner.tsx
import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const AdBanner = () => {
  // Si deseas usar IDs de prueba o tus IDs reales:
  const adUnitID =
    Platform.OS === 'ios'
      ? 'ca-app-pub-3940256099942544/2934735716' // ID de prueba para iOS
      : 'ca-app-pub-3940256099942544/6300978111'; // ID de prueba para Android

  return (
    <View style={styles.adContainer}>
      <BannerAd
        unitId={adUnitID}
        size={BannerAdSize.SMART_BANNER}
        requestOptions={{
          // Cambia a true si deseas anuncios no personalizados
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdFailedToLoad={(error) => console.error('AdMob error:', error)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  adContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
});

export default AdBanner;
