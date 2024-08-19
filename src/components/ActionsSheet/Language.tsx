import React, { useMemo } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  InteractionManager,
} from "react-native";

import { Colors } from "../../config";
import useDeviceStore from "../../store/useDeviceStore";
import useI18nStore from "../../store/useI18nStore";
import { Icon } from "../Icon";
import SplitLine from "../SplitLine";
import { SupportLocaleProps } from "../../../locales";
import usePreferenceStore from "../../store/usePreferenceStore";

import OptionSheet from "./OptionSheet";

interface LanguageSheetProps {
  onSelect: (loacl: SupportLocaleProps) => void;
}

const LanguageComponent: React.FC<LanguageSheetProps> = (props) => {
  const { onSelect } = props;
  const { getSupportLocale } = useI18nStore();
  const { switchLocal, local } = usePreferenceStore();
  const { width } = useDeviceStore();

  const support = useMemo(() => {
    return getSupportLocale();
  }, [getSupportLocale]);

  return (
    <>
      {support.map((param) => {
        return (
          <View key={param.locale}>
            <TouchableOpacity
              onPress={() => {
                switchLocal(param);
                onSelect(param);
                // TIPS: 切换语言对象对于js线程负担太大，直接调用hide方法不会显示动画效果
                // 放入交互器中之后好很多
                InteractionManager.runAfterInteractions(() => {
                  Language.hide();
                });
              }}
              style={styles.itemContainer}
            >
              <Text style={styles.itemTitle}>{param.language}</Text>
              {local?.locale === param.locale ? (
                <Icon name="check" color={Colors.theme} />
              ) : null}
            </TouchableOpacity>
            <SplitLine start={0} end={width - 40} />
          </View>
        );
      })}
    </>
  );
};

// TODO: 在replyObj中获取
const Language = {
  show: (params: LanguageSheetProps) => {
    OptionSheet.show({
      title: "switch_language_title",
      needCancle: true,
      items: <LanguageComponent {...params} />,
    });
  },
  hide: OptionSheet.hide,
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  itemTitle: {
    fontSize: 16,
  },
});

export default Language;
