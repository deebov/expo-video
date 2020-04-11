# Video component for Expo/React Native

This library is a wrapper around Expo's expo-av library. Because Expo's video api is not really simple this component was built to make it simpler.

## Install
```bash
yarn add expo-video
```

## Usage
<!-- Head to [examples](./examples) folder for more examples -->

```tsx
import React from 'react';
import { SafeAreaView } from 'react-native';
import { Video } from 'expo-video';

export default function App() {
  const [paused, setPaused] = useState(false);
  const [volume, setVolume] = useState(1);
  const videoRef = useRef<Video>(null);

  const onBuffer = (buffering: boolean) => {
    console.log('buffering', buffering);
  };

  const onFinish = () => {
    console.log('FINISHED');
  };

  const onProgress = (progress: Progress) => {
    console.log(progress.percent);
  };

  const onPlay = (playing: boolean) => {
    console.log('playing', playing);
  };

  const onVolumeChange = (volume: number) => {
    console.log('volume', volume);
  };

  const increaseVolume = () => {
    setVolume((oldVolume) => Math.min(oldVolume + 0.1, 1));
  };

  const decreaseVolume = () => {
    setVolume((oldVolume) => Math.max(oldVolume - 0.1, 0));
  };

  const rePlay = () => videoRef.current?.replayAsync();
  const fullscreen = () => videoRef.current?.presentFullscreenPlayer();
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Button title="Play" onPress={() => setPaused((state) => false)} />
        <Button title="Pause" onPress={() => setPaused((state) => true)} />
        <Button title="Toggle" onPress={() => setPaused((state) => !state)} />
        <Button title="Replay" onPress={rePlay} />
        <Button title="Fullscreen" onPress={fullscreen} />
        <Button title="Increase" onPress={increaseVolume} />
        <Button title="Decrease" onPress={decreaseVolume} />
      </View>
      <Video
        ref={videoRef}
        paused={paused}
        volume={volume}
        source={{ uri: 'https://your-domain.com/video.mp4' }}
        progressUpdateIntervalMillis={10}
        style={styles.video}
        onPlay={onPlay}
        onBuffer={onBuffer}
        onVolumeChange={onVolumeChange}
        onProgress={onProgress}
        onEnd={onFinish}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: '50%',
    height: 200,
  },
});
```

## Props

Props extends Expo's expo-av props. So you can pass any prop that expo-av takes.

Prop | Description | Type | Default
------ | ------ | ------ | ------
**`paused(paused:boolean)`** | If `true` video will be paused, if `false` then video will be started from the position it was paused | Callback | `false`
**`bufferUpdateInterval(interval:number)`** | Waits `inteval` milliseconds before comparing previous `isBuffering` state and current `isBuffering`. If changed, then calls `onBuffer` if provided | Callback | `10`
**`onPlay(isPlaying:boolean)`** | Gets called when `isPlaying` status is changed | Callback 
**`onBuffer(isBuffering:boolean)`** | Gets called when `isBuffering` status is changed | Callback 
**`onProgress(progress:Progress)`** | Gets called when position milliseconds are changed or within `progressUpdateIntervalMillis` interval time | Callback 
**`onPlayableProgress(playableProgress:PlayableProgress)`** | Gets called when playable duration is changed or within `progressUpdateIntervalMillis` interval time | Callback 
**`onVolumeChange(volume:number)`** | Gets called when `volume` is changed | Callback 
**`onEnd(isPlaying:boolean)`** | Gets called when video ends | Callback 

## Types

### Progress

```
type Progress = {
  progress: number;
  percent: number;
}
```

### PlayableProgress

```
type PlayableProgress = {
  playableDuration: number;
  playableDurationPercent: number;
}
```

## Todo

- [ ] Provide more examples

