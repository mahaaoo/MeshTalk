import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { openBrowserAsync } from "expo-web-browser";
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
  id?: string;
}

const HTMLContent: React.FC<HTMLContentProps> = (props) => {
  const { html, tagsStyles, blur = false, spoilerText = "", id = "" } = props;
  const { width } = useWindowDimensions();
  const { checkSensitive, addSensitive } = useStatusStore();
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
              console.log("打开链接", href);
              openBrowserAsync(href);
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
            }}
            onPress={() => {
              setShowBlur(false);
              addSensitive(id);
            }}
          >
            <Text style={{ fontSize: 18, color: "#333" }}>{spoilerText}</Text>
            <Text style={{ fontSize: 14, color: Colors.theme, marginTop: 5 }}>
              点击查看
            </Text>
          </TouchableOpacity>
        </BlurView>
      ) : null}
    </View>
  );
};

export default HTMLContent;
