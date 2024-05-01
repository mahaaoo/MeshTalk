import React from "react";
import {
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  Text,
  StyleSheet,
  TextStyle,
} from "react-native";

import Color from "../../config/colors";
import { useDebounce } from "../../utils/hooks";

interface ButtonType {
  onPress: () => void;
  text: string;

  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Button: React.FC<ButtonType> = (props) => {
  const { onPress, style, text, textStyle } = props;

  const handlePress = useDebounce(
    () => {
      onPress && onPress();
    },
    300,
    [onPress],
  );

  return (
    <TouchableOpacity onPress={handlePress} style={[styles.out_view, style]}>
      <Text style={[styles.inner_view, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  out_view: {
    padding: 15,
    backgroundColor: Color.buttonDefaultBackground,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  inner_view: {
    color: Color.defaultWhite,
    fontSize: 18,
  },
});

export default Button;
