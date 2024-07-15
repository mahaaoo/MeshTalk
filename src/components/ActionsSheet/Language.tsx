import React, { useMemo } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  InteractionManager,
} from "react-native";
import { TranslateContainer, ModalUtil } from "react-native-ma-modal";

import { Colors } from "../../config";
import { ACTIONMODALIDREPLY } from "../../config/constant";
import useDeviceStore from "../../store/useDeviceStore";
import useI18nStore from "../../store/useI18nStore";
import { Icon } from "../Icon";
import SplitLine from "../SplitLine";
import { SupportLocaleProps } from "../../../locales";

interface ActionsSheetTyps {
  onSelect: (loacl: SupportLocaleProps) => void;
}

const LanguageComponent: React.FC<ActionsSheetTyps> = (props) => {
  const { onSelect } = props;
  const { i18n, getSupportLocale, switchLocale, local } = useI18nStore();
  const { width } = useDeviceStore();

  const support = useMemo(() => {
    return getSupportLocale();
  }, [getSupportLocale]);

  return (
    <View
      style={[
        styles.scrollViewContainer,
        { paddingBottom: useDeviceStore.getState().insets.bottom },
      ]}
    >
      <View style={styles.titleContainer} />
      <Text style={styles.title}>{i18n.t("switch_language_title")}</Text>
      <View style={[styles.item, { marginTop: 10 }]}>
        {support.map((param) => {
          return (
            <View key={param.locale}>
              <TouchableOpacity
                onPress={() => {
                  switchLocale(param);
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
      </View>
      <TouchableOpacity
        onPress={() => {
          Language.hide();
        }}
        style={[styles.item, styles.cacelButton]}
      >
        <Text style={styles.itemTitle}>{i18n.t("new_status_ares_cancel")}</Text>
      </TouchableOpacity>
    </View>
  );
};

// TODO: 在replyObj中获取
const Language = {
  key: ACTIONMODALIDREPLY,
  template: ({ onSelect }: ActionsSheetTyps) => {
    return (
      <TranslateContainer gesture>
        <LanguageComponent {...{ onSelect }} />
      </TranslateContainer>
    );
  },
  show: (params: ActionsSheetTyps) => {
    ModalUtil.add(Language.template(params), Language.key);
  },
  hide: () => ModalUtil.remove(Language.key || ""),
  isExist: () => ModalUtil.isExist(Language.key || ""),
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollViewContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    width: useDeviceStore.getState().width,
  },
  titleContainer: {
    width: 80,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.defaultLineGreyColor,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  item: {
    width: useDeviceStore.getState().width - 40,
    marginHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  itemContainer: {
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  functionContainer: {
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  itemTitle: {
    fontSize: 16,
  },
  acct: {
    fontSize: 13,
    color: Colors.grayTextColor,
  },
  cacelButton: {
    marginTop: 15,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Language;
