import { useRef, useEffect } from "react";

export default function useNotificationSounds() {
  const audioMap = useRef({});

  useEffect(() => {
    audioMap.current = {
      success: new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1235-swift-gesture.ogg"),
      error: new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1230-pretty-good.ogg"),
      inform: new Audio("https://notificationsounds.com/storage/sounds/file-sounds-1145-when.ogg"),
    };

    Object.values(audioMap.current).forEach(audio => {
      audio.preload = "auto";
    });

    return () => {
      Object.values(audioMap.current).forEach(audio => audio.pause());
      audioMap.current = {};
    };
  }, []);

  const play = (type) => {
    const audio = audioMap.current[type];
    if (!audio) return;
    audio.currentTime = 0; // restart from beginning
    audio.play();
  };

  return { play };
}
