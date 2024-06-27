import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  useWindowDimensions,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import HTML, {
  CustomBlockRenderer,
  defaultHTMLElementModels,
  HTMLContentModel,
  useInternalRenderer,
} from "react-native-render-html";

import Colors from "../../config/colors";
import useStatusStore from "../../store/useStatusStore";
import useI18nStore from "../../store/useI18nStore";
import { openURL } from "@utils/media";
import { Mention, Tag } from "../../config/interface";
import { getAcctFromUrl } from "@utils/string";
import { router } from "expo-router";

const defaultTagsStyles = {
  p: {
    fontSize: 16,
    lineHeight: 23,
  },
  a: {
    fontSize: 16,
    lineHeight: 23,
    textDecorationLine: "none",
    color: Colors.linkTagColor,
  },
};

const customHTMLElementModels = {
  img: defaultHTMLElementModels.img.extend({
    contentModel: HTMLContentModel.mixed,
  }),
};

const ImageRenderer: CustomBlockRenderer = (props) => {
  const { rendererProps } = useInternalRenderer("img", props);
  const { source, style: imgStyle, width, height } = rendererProps;
  return (
    <Image
      source={source}
      style={[imgStyle, { width: Number(width), height: Number(height) }]}
      contentFit="cover"
    />
  );
};

const renderers = { img: ImageRenderer };

interface HTMLContentProps {
  html: string;
  tagsStyles?: any;
  blur?: boolean;
  spoilerText?: string;
  id?: string;  // 该条嘟文的id，为了记录是否已经展示过敏感信息set记录
  mentions?: Mention[];
  tags?: Tag[];
}

const HTMLContent: React.FC<HTMLContentProps> = (props) => {
  const { html, tagsStyles, blur = false, spoilerText = "", id = "", mentions, tags } = props;
  const { width } = useWindowDimensions();
  const { checkSensitive, addSensitive } = useStatusStore();
  const { i18n } = useI18nStore();
  const [showBlur, setShowBlur] = useState(() => {
    if (checkSensitive(id)) return false;
    return blur;
  });

  // TODO: 过长的内容，需要有一个max-height来省略过多的内容，类似于展开全文
  // 可以考虑自行拆解 目前有<a> <p> <img> <span> <br />
  return (
    <View>
      <HTML
        source={{ html }}
        tagsStyles={tagsStyles || defaultTagsStyles}
        contentWidth={width}
        renderers={renderers}
        customHTMLElementModels={customHTMLElementModels}
        renderersProps={{
          a: {
            onPress: (_, href) => {
              console.log("HTMLContent <a>", href);
              if (href.indexOf("/tags/") !== -1) {
                // 打开相应的tag
                console.log("打开相应的tag", tags);
                const splitList = href.split("/");
                const last = splitList[splitList.length - 1];

                const matchTag = tags?.filter(tag => {
                  const tagUrls = tag.url.split("/");
                  const tagLast = tagUrls[tagUrls.length - 1];
                  return tagLast === last;
                });
                if (matchTag && matchTag?.length > 0) {
                  // 是一个合理的tag值
                  return router.push({
                    pathname: "/tag/[id]",
                    params: {
                      id: matchTag[0].name,
                    },
                  });              
                }

                console.log("是一个非法的tag或者匹配失败");
              } else if (href.indexOf("@") !== -1) {
                // console.log(mentions)
                const getAcct = getAcctFromUrl(href);

                const user = mentions?.filter(m => m.username === getAcct) || [];
                if (user?.length > 0) {
                  return router.push({
                    pathname: "/user/[id]",
                    params: {
                      acct: user[0].acct,
                    },
                  });              
                }
              }
              openURL(href);
              // console.log("123", href)
            },
          },
        }}
      />
      {showBlur ? (
        <BlurView
          intensity={95}
          style={{
            position: "absolute",
            top: 10,
            left: 0,
            bottom: 0,
            right: 0,
            width: "100%",
          }}
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
            onPress={() => {
              setShowBlur(false);
              addSensitive(id);
            }}
          >
            <Text style={{ fontSize: 18, color: "#333" }}>{spoilerText}</Text>
            <Text style={{ fontSize: 14, color: Colors.theme, marginTop: 5 }}>
              {i18n.t("html_content_sensitive_show")}
            </Text>
          </TouchableOpacity>
        </BlurView>
      ) : null}
    </View>
  );
};

export default HTMLContent;
