import React from "react";
import { Text, ScrollView } from "react-native";
import { Screen, ListRow, ActionsSheet } from "@components";
import useI18nStore from "../store/useI18nStore";
import { Switch } from "react-native-gesture-handler";
import { Colors } from "../config";
import usePreferenceStore from "../store/usePreferenceStore";
import { getPostVisibility } from "@config/i18nText";

interface PreferencesProps {}

const Preferences: React.FC<PreferencesProps> = (props) => {
  const { i18n } = useI18nStore();
  const { sensitive, autoPlayGif, switchLocal, local, replyVisibility } =
    usePreferenceStore();
  const replyObj = getPostVisibility(i18n);

  return (
    <Screen headerShown title={i18n.t("page_title_preferences")}>
      <ScrollView>
        <ListRow
          title={i18n.t("perferences_language_text")}
          rightView={
            <Text style={{ fontSize: 16, color: Colors.grayTextColor }}>
              {local?.language}
            </Text>
          }
          onPress={() => {
            ActionsSheet.Language.show({
              onSelect: (local) => {
                switchLocal(local);
              },
            });
          }}
        />
        <ListRow
          title={i18n.t("perferences_sensitive_text")}
          rightIcon={null}
          rightView={
            <Switch
              value={sensitive}
              trackColor={{ false: "#fff", true: Colors.theme }}
              onValueChange={(value) => {
                usePreferenceStore.setState({ sensitive: value });
              }}
            />
          }
          onPress={() => {}}
        />
        <ListRow
          title={i18n.t("perferences_brower_text")}
          rightView={
            <Text style={{ fontSize: 16, color: Colors.grayTextColor }}>
              app内打开
            </Text>
          }
          onPress={() => {
            ActionsSheet.LinkType.show({
              onSelect: () => {},
            });
          }}
        />
        <ListRow
          title={i18n.t("perferences_dodo_text")}
          rightView={
            <Text style={{ fontSize: 16, color: Colors.grayTextColor }}>
              {replyVisibility.title}
            </Text>
          }
          onPress={() => {
            ActionsSheet.Reply.show({
              params: replyObj as never,
              onSelect: (reply) => {
                usePreferenceStore.setState({
                  replyVisibility: reply,
                });
                ActionsSheet.Reply.hide();
              },
              onClose: () => {},
            });
          }}
        />
        <ListRow
          title={i18n.t("perferences_gif_text")}
          rightIcon={null}
          rightView={
            <Switch
              value={autoPlayGif}
              trackColor={{ false: "#fff", true: Colors.theme }}
              onValueChange={(value) => {
                usePreferenceStore.setState({ autoPlayGif: value });
              }}
            />
          }
          onPress={() => {}}
        />
      </ScrollView>
    </Screen>
  );
};

export default Preferences;
