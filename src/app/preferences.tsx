import React from 'react';
import {View, Text} from 'react-native';
import { Screen, ListRow, Icon } from "@components";
import useI18nStore from '../store/useI18nStore';
import { Switch } from 'react-native-gesture-handler';

interface PreferencesProps {
};

const Preferences: React.FC<PreferencesProps> = props => {
  const {} = props;
  const { i18n, switchLocale } = useI18nStore();

  return (
    <Screen headerShown title={i18n.t("page_title_preferences")}>
      <View>
        <ListRow
          title={i18n.t("setting_lanuage")}
          rightView={<Text>zh</Text>}
          onPress={() => {
            switchLocale(i18n.locale === "zh" ? "en" : "zh");
          }}
        />
        <ListRow
          title={"敏感信息是否显示"}
          rightIcon={null}
          rightView={<Switch />}
          onPress={() => {
            
          }}
        />
        <ListRow
          title={"浏览器打开方式"}
          rightView={<Text>app内打开</Text>}
          onPress={() => {
            
          }}
        />
        <ListRow
          title={"默认嘟文可见性"}
          rightView={<Text>全部</Text>}
          onPress={() => {
            
          }}
        />
        <ListRow
          title={"自动播放gif"}
          rightIcon={null}
          rightView={<Switch />}
          onPress={() => {
            
          }}
        />
      </View>
    </Screen>
  )
};

export default Preferences;
