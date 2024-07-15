import React, { useState } from "react";
import { View, Text } from "react-native";
import { Screen, ListRow, ActionsSheet } from "@components";
import useI18nStore from "../store/useI18nStore";
import { Switch } from "react-native-gesture-handler";
import { Colors } from "../config";

interface PreferencesProps {}

const Preferences: React.FC<PreferencesProps> = (props) => {
  const {} = props;
  const { i18n, local } = useI18nStore();
  const [currentLocal, setCurrentLocal] = useState(local?.language || "");

  return (
    <Screen headerShown title={i18n.t("page_title_preferences")}>
      <View>
        <ListRow
          title={i18n.t("setting_lanuage")}
          rightView={
            <Text style={{ fontSize: 16, color: Colors.grayTextColor }}>
              {currentLocal}
            </Text>
          }
          onPress={() => {
            ActionsSheet.Language.show({
              onSelect: (local) => {
                setCurrentLocal(local.language);
              },
            });
          }}
        />
        <ListRow
          title={"敏感信息是否显示"}
          rightIcon={null}
          rightView={<Switch />}
          onPress={() => {}}
        />
        <ListRow
          title={"浏览器打开方式"}
          rightView={<Text>app内打开</Text>}
          onPress={() => {}}
        />
        <ListRow
          title={"默认嘟文可见性"}
          rightView={<Text>全部</Text>}
          onPress={() => {}}
        />
        <ListRow
          title={"自动播放gif"}
          rightIcon={null}
          rightView={<Switch />}
          onPress={() => {}}
        />
      </View>
    </Screen>
  );
};

export default Preferences;
