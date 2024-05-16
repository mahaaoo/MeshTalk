import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import Web from "react-native-webview";

import { RedirectUris } from "../config/oauth";
import useLoginStore from "../store/useLoginStore";

interface WebViewParams {}

const WebView: React.FC<WebViewParams> = (props) => {
  const { initUrl = "" } = useLocalSearchParams();
  const navigation = useNavigation();
  const { webGetToken } = useLoginStore();

  /** example:
   *  canGoBack: true
      canGoForward: false
      loading: false
      target: 197
      title: "mah93"
      url: "https://mah93.github.io/?code=1VV2En_DVAARI2f1B2Ov3gNfH7P5
   */
  const handleUrlChange = (urlBody: any) => {
    console.log(urlBody);
    navigation.setOptions({ title: urlBody.title });

    const url = urlBody?.url || "";
    if (url?.startsWith(RedirectUris) > 0 && url?.indexOf("code") > 0) {
      const urlList = url.split("?");
      if (urlList.length === 2 && urlList[1].length !== 0) {
        const codeList = urlList[1].split("=");
        webGetToken(codeList[1]);
        router.back();
      }
    }
  };

  return (
    <Web
      style={styles.container}
      source={{ uri: initUrl }}
      onNavigationStateChange={handleUrlChange}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WebView;
