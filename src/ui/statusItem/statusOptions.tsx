import { Icon } from "@components";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, {
  useAnimatedRef,
  runOnUI,
  measure,
} from "react-native-reanimated";

import { styles } from "./index.style";
import useDeviceStore from "../../store/useDeviceStore";

interface StatusOptionsProps {}

const StatusOptions: React.FC<StatusOptionsProps> = (props) => {
  const aref = useAnimatedRef();
  const { height } = useDeviceStore();

  // {"height": 38, "pageX": 350, "pageY": 410.3333333333335, "width": 38, "x": 350, "y": 0}
 
  const handlePress = () => {
    runOnUI(() => {
      const measurement = measure(aref);
      if (measurement === null) {
      }
      console.log(measurement);
      if (measurement!.pageY > height / 2) {
        // 向下弹出
      } else {
        // 向上弹出
      }
    })();
  };

  return (
    <Animated.View ref={aref} style={styles.more}>
      <TouchableOpacity onPress={handlePress}>
        <Icon name="three_point" size={18} color="#bbb" />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default StatusOptions;
