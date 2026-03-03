import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Dimensions, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';

const TensorCamera = cameraWithTensors(CameraView);
const { width, height } = Dimensions.get('window');

export default function WorkoutCameraScreen({ route, navigation }) {
  const { challenge } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const [isReady, setIsReady] = useState(false);
  const [detector, setDetector] = useState(null);
  const [counter, setCounter] = useState(0);
  const [stage, setStage] = useState('up');
  const [debug, setDebug] = useState("A aguardar corpo...");

  useEffect(() => {
    async function prepare() {
      try {
        await tf.ready();
        const model = poseDetection.SupportedModels.MoveNet;
        const _detector = await poseDetection.createDetector(model, {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          runtime: 'tfjs',
        });
        setDetector(_detector);
        setIsReady(true);
      } catch (err) {
        setDebug("Erro: Reinicie o Expo.");
      }
    }
    prepare();
  }, []);

  // Lógica de processamento corrigida
  const handleCameraStream = (images, updatePreview, gl) => {
    const loop = async () => {
      if (!detector) return;

      try {
        const nextImageTensor = images.next().value;
        if (!nextImageTensor) {
          requestAnimationFrame(loop);
          return;
        }

        const poses = await detector.estimatePoses(nextImageTensor);

        if (poses && poses.length > 0) {
          const kp = poses[0].keypoints;
          const nose = kp.find(k => k.name === 'nose');
          const lSh = kp.find(k => k.name === 'left_shoulder');
          const rSh = kp.find(k => k.name === 'right_shoulder');

          // Verificamos a confiança da IA
          if (nose?.score > 0.25) {
            const shY = (lSh?.score > rSh?.score) ? lSh.y : rSh.y;
            setDebug(`IA ATIVA: N:${Math.round(nose.y)} | O:${Math.round(shY)}`);

            // LÓGICA FLEXÃO FRONTAL
            if (nose.y > shY + 12) { 
              if (stage !== 'down') setStage('down');
            }
            if (stage === 'down' && nose.y < shY + 3) {
              setCounter(prev => prev + 1);
              setStage('up');
            }
          } else {
            setDebug("IA a ver, mas sem confiança...");
          }
        }

        tf.dispose(nextImageTensor);
      } catch (err) {
        console.error("Erro no loop:", err);
      }
      
      requestAnimationFrame(loop);
    };
    loop();
  };

  if (!permission?.granted || !isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0099ff" />
        <Text style={styles.loadingText}>A SINCRONIZAR IA...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TensorCamera
        style={styles.camera}
        facing="front"
        autorender={true}
        cameraTextureHeight={1920}
        cameraTextureWidth={1080}
        resizeHeight={192}
        resizeWidth={192}
        resizeDepth={3}
        onReady={handleCameraStream}
      />
      
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Ionicons name="close" size={30} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.counterBox}>
            <Text style={styles.counterNumber}>{counter}</Text>
            <Text style={styles.counterLabel}>REPETIÇÕES</Text>
          </View>
          <View style={{ width: 50 }} />
        </View>

        <View style={styles.debugPanel}>
          <Text style={styles.debugText}>{debug}</Text>
          <Text style={[styles.debugText, {color: stage === 'down' ? '#00ff88' : 'yellow', fontSize: 14}]}>
            {stage === 'down' ? "BOA! SOBE!" : "ESTADO: A AGUARDAR DESCIDA"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  loadingContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#0099ff', marginTop: 20, fontWeight: 'bold' },
  overlay: { ...StyleSheet.absoluteFillObject, padding: 30, paddingTop: 60, justifyContent: 'space-between' },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  closeBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  counterBox: { alignItems: 'center' },
  counterNumber: { color: '#FFF', fontSize: 80, fontWeight: '900' },
  counterLabel: { color: '#0099ff', fontSize: 12, fontWeight: 'bold' },
  debugPanel: { backgroundColor: 'rgba(0,0,0,0.8)', padding: 15, borderRadius: 15, alignSelf: 'center' },
  debugText: { color: 'yellow', fontSize: 11, fontWeight: 'bold', textAlign: 'center' }
});