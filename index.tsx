import React, { useRef, useEffect, forwardRef } from 'react';
import {
  Video as AVideo,
  AVPlaybackStatus,
  VideoProps as AVideoProps,
} from 'expo-av';
import { useDebouncedCallback } from 'use-debounce';
import useCombinedRefs from './useCombinedRefs';

export type Progress = {
  progress: number;
  percent: number;
};

export type PlayableProgress = {
  playableDuration: number;
  playableDurationPercent: number;
};

export type Video = AVideo;

export interface VideoProps extends AVideoProps {
  paused?: boolean;
  bufferUpdateInterval?: number;
  onPlay?: (playing: boolean) => void;
  onBuffer?: (buffering: boolean) => void;
  onVolumeChange?: (volume: number) => void;
  onEnd?: () => void;
  onProgress?: (progress: Progress) => void;
  onPlayableProgress?: (progress: PlayableProgress) => void;
}

export const Video = forwardRef<AVideo, VideoProps>((props, ref) => {
  const videoRef = useRef<AVideo>(null);
  const buffering = useRef(false);
  const progress = useRef(0);
  const playableProgress = useRef(0);
  const playing = useRef(false);
  const volume = useRef(1);
  const combinedRef = useCombinedRefs(ref, videoRef);

  const [debouncedCallback] = useDebouncedCallback((value: boolean) => {
    if (value !== buffering.current) {
      props.onBuffer?.(value);
      buffering.current = value;
    }
  }, props.bufferUpdateInterval || 10);

  useEffect(() => {
    if (props.paused) {
      combinedRef?.current?.pauseAsync();
    } else {
      combinedRef?.current?.playAsync();
    }
  }, [props.paused]);

  const onStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      const {
        isBuffering,
        isPlaying,
        positionMillis,
        playableDurationMillis = 0,
        durationMillis = 0,
      } = status;

      // PLAYING
      if (typeof props.onPlay == 'function' && isPlaying !== playing.current) {
        props.onPlay(isPlaying);
        playing.current = isPlaying;
      }

      // BUFFERING
      if (typeof props.onBuffer === 'function') {
        debouncedCallback(isBuffering);
      }

      // PROGRESS
      if (
        typeof props.onProgress === 'function' &&
        progress.current !== positionMillis
      ) {
        props.onProgress({
          progress: positionMillis,
          percent: (100 * positionMillis) / durationMillis,
        });
        progress.current = positionMillis;
      }

      // PLAYABLE PROGRESS
      if (
        typeof props.onPlayableProgress === 'function' &&
        playableProgress.current !== playableDurationMillis
      ) {
        props.onPlayableProgress({
          playableDuration: playableDurationMillis,
          playableDurationPercent:
            (100 * playableDurationMillis) / durationMillis,
        });
        playableProgress.current = playableDurationMillis;
      }

      // VOLUME
      if (
        typeof props.onVolumeChange === 'function' &&
        volume.current !== status.volume
      ) {
        props.onVolumeChange(status.volume);
        volume.current = status.volume;
      }

      // END
      if (typeof props.onEnd === 'function' && status.didJustFinish) {
        props.onEnd();
      }
    }
  };

  return (
    <AVideo
      onPlaybackStatusUpdate={onStatusUpdate}
      ref={combinedRef}
      {...props}
    />
  );
});

export default Video;
