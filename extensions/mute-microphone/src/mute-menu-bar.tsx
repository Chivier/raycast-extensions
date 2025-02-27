import { Cache, Color, Icon, MenuBarExtra } from "@raycast/api";
import { useEffect, useState } from "react";
import { getCurrentAudioInputLevel, toggleSystemAudioInputLevel } from "./shared/utils";

export default function muteMenuBar() {
  const cache = new Cache();
  const cachedValue = cache.get("currentAudioInputLevel");
  const cachedValueNumber = cachedValue == undefined ? 1 : Number(cachedValue);
  const disabledIcon = { source: Icon.MicrophoneDisabled, tintColor: Color.Red };
  const enabledIcon = { source: Icon.Microphone };

  const [currentAudioInputLevel, setCurrentAudioInputLevel] = useState<number>(cachedValueNumber);
  const icon = currentAudioInputLevel == 0 ? disabledIcon : enabledIcon;
  const menuItemText = currentAudioInputLevel == 0 ? "Unmute" : "Mute";

  useEffect(() => {
    const newValue = getCurrentAudioInputLevel();
    if (!isNaN(newValue)) {
      setCurrentAudioInputLevel(newValue);
      cache.set("currentAudioInputLevel", newValue.toString());
    }
  }, []);

  return (
    <MenuBarExtra icon={icon} tooltip="Audio input volume">
      <MenuBarExtra.Item
        title={menuItemText}
        onAction={async () => {
          const newLevel = await toggleSystemAudioInputLevel(currentAudioInputLevel);
          setCurrentAudioInputLevel(Number(newLevel));
        }}
      />
    </MenuBarExtra>
  );
}
