import { useEffect, useState } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { City, BusLine, Location } from '../models/BusSearch.model';
import busStopsData from '../data/busStops.json';

const useBusSearchViewModel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [busLines, setBusLines] = useState<BusLine[]>([]);
  const [selectedLine, setSelectedLine] = useState<BusLine | null>(null);
  const [walkingTime, setWalkingTime] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos del JSON
  useEffect(() => {
    const loadData = () => {
      try {
        const allLines = (busStopsData as City[]).flatMap(city => city.lines);
        setBusLines(allLines);
        setLoading(false);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Obtener ubicación del usuario
  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => console.error('Error de geolocalización:', error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  // Calcular tiempo caminando
  const calculateWalkingTime = (line: BusLine) => {
    if (!userLocation) return;

    let nearestDistance = Infinity;
    
    line.stops.forEach(stop => {
      const R = 6371;
      const φ1 = userLocation.latitude * Math.PI / 180;
      const φ2 = stop.coordinates.latitude * Math.PI / 180;
      const Δφ = (stop.coordinates.latitude - userLocation.latitude) * Math.PI / 180;
      const Δλ = (stop.coordinates.longitude - userLocation.longitude) * Math.PI / 180;

      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      if (distance < nearestDistance) nearestDistance = distance;
    });

    const time = (nearestDistance / 5) * 60; // 5 km/h velocidad
    setWalkingTime(Math.round(time));
  };

  return {
    searchQuery,
    setSearchQuery,
    busLines,
    selectedLine,
    walkingTime,
    loading,
    calculateWalkingTime
  };
};

export default useBusSearchViewModel;