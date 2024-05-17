import { Image } from "expo-image";
import { openBrowserAsync } from "expo-web-browser";
import React from "react";
import { useWindowDimensions } from "react-native";
import HTML, {
  CustomBlockRenderer,
  defaultHTMLElementModels,
  HTMLContentModel,
  useInternalRenderer,
} from "react-native-render-html";

import Colors from "../../config/colors";

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
}

const HTMLContent: React.FC<HTMLContentProps> = (props) => {
  const { html, tagsStyles } = props;
  const { width } = useWindowDimensions();
  // TODO: 过长的内容，需要有一个max-height来省略过多的内容，类似于展开全文
  // 可以考虑自行拆解 目前有<a> <p> <img> <span> <br />
  return (
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
  );
};

export default HTMLContent;
