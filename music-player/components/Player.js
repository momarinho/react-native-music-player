import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import useSound from 'use-sound';
import { Audio } from 'expo-av';
import { Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

import ncs from '../assets/ncs.mp3';
import tavern from '../assets/tavern.jpg';

export default function Player() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackObject, setPlaybackObject] = useState(null);
  const [time, setTime] = useState({
    min: '',
    sec: '',
  });
  const [currentTime, setCurrentTime] = useState({
    min: '',
    sec: '',
  });
  const [seconds, setSeconds] = useState(0);

  const loadSound = async () => {
    const { sound } = await Audio.Sound.createAsync(ncs);
    setPlaybackObject(sound);
  };

  useEffect(() => {
    loadSound();
  }, []);

  const playButton = async () => {
    if (isPlaying) {
      await playbackObject.pauseAsync();
      setIsPlaying(false);
    } else {
      await playbackObject.playAsync();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const getDuration = async () => {
      const duration = await playbackObject.getStatusAsync();
      const sec = duration.durationMillis / 1000;
      const min = Math.floor(sec / 60);
      const secRemain = Math.floor(sec % 60);
      setTime({
        min: min,
        sec: secRemain,
      });
    };
    if (playbackObject) {
      getDuration();
    }
  }, [playbackObject]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (playbackObject) {
        const status = await playbackObject.getStatusAsync();
        setSeconds(status.positionMillis / 1000);
        const min = Math.floor(status.positionMillis / 60000);
        const sec = Math.floor((status.positionMillis % 60000) / 1000);
        setCurrentTime({
          min,
          sec,
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [playbackObject]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Playing</Text>
      <Image source={tavern} style={styles.musicCover} />
      <View style={styles.songDetails}>
        <Text style={styles.title}>Need You [NCS Release]</Text>
        <Text style={styles.subtitle}>Yonexx & lunar</Text>
      </View>
      <View style={styles.timerContainer}>
        <Text
          style={styles.timer}
        >{`${currentTime.min}:${currentTime.sec}`}</Text>
        <Slider
          style={{ width: 250, height: 40 }}
          minimumValue={0}
          maximumValue={time.min * 60 + time.sec}
          minimumTrackTintColor="#2F426C"
          maximumTrackTintColor="#7B89AE"
          thumbTintColor="#2F426C"
          value={seconds}
        />
        <Text style={styles.timer}>{`${time.min}:${time.sec}`}</Text>
      </View>
      <View style={styles.playerControls}>
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="play-skip-back" size={32} color="#7B89AE" />
        </TouchableOpacity>

        {!isPlaying ? (
          <TouchableOpacity style={styles.controlButton} onPress={playButton}>
            <AntDesign name="playcircleo" size={48} color="#2F426C" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.controlButton} onPress={playButton}>
            <AntDesign name="pausecircle" size={48} color="#2F426C" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.controlButton}>
          <Ionicons name="play-skip-forward" size={32} color="#7B89AE" />
        </TouchableOpacity>
      </View>

      <View style={styles.volumeContainer}>
        <MaterialIcons name="volume-down" size={24} color="#2F426C" />
        <Slider
          style={{ width: 200, height: 40 }}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#2F426C"
          maximumTrackTintColor="#7B89AE"
          thumbTintColor="#2F426C"
        />
        <MaterialIcons name="volume-up" size={24} color="#2F426C" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#7B89AE',
  },
  musicCover: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginTop: 50,
    marginBottom: 20,
  },
  songDetails: {
    alignItems: 'center',
    marginBottom: 20,
  },
  playerControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '70%',
    marginBottom: 20,
  },
  controlButton: {
    borderRadius: 50,
    padding: 10,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
    marginBottom: 20,
  },
  timer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2F426C',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
  },
});
