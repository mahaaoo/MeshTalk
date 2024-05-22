import { Icon } from "@components";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, {
  useAnimatedRef,
  runOnUI,
  measure,
  runOnJS,
} from "react-native-reanimated";

import { styles } from "./index.style";
import { PopOptonsUtil } from "../../components/PopOptions";

interface StatusOptionsProps {
  acct: string;
}

const StatusOptions: React.FC<StatusOptionsProps> = (props) => {
  const { acct } = props;
  const aref = useAnimatedRef();

  const handlePress = () => {
    runOnUI(() => {
      const measurement = measure(aref);
      if (measurement !== null) {
        runOnJS(PopOptonsUtil.show)(measurement, acct);
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
