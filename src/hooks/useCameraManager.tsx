import { useState, useRef, useCallback, useEffect } from 'react';

interface UseCameraManagerOptions {
  facingMode: 'user' | 'environment';
  autoStart?: boolean;
}

export const useCameraManager = ({ facingMode, autoStart = false }: UseCameraManagerOptions) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setStream(null);
    }
  }, []);

  const startCamera = useCallback(async () => {
    // Always release first
    stopCamera();
    setError(null);

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = newStream;
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      return newStream;
    } catch (err) {
      console.error('Camera access error:', err);
      setError('denied');
      return null;
    }
  }, [facingMode, stopCamera]);

  // Attach stream to video when either changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Auto-start if requested
  useEffect(() => {
    if (autoStart) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const captureImage = useCallback((): string | null => {
    if (!videoRef.current) return null;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(videoRef.current, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  return {
    videoRef,
    stream,
    error,
    startCamera,
    stopCamera,
    captureImage,
    isActive: !!stream,
  };
};
