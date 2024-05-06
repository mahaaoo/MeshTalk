import { Image } from "expo-image";
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
    lineHeight: 20,
  },
  a: {
    fontSize: 16,
    lineHeight: 20,
    textDecorationLine: "none",
    color: Colors.linkTagColor,
  },
};

const customHTMLElementModels = {
  img: defaultHTMLElementModels.img.extend({
    contentModel: HTMLContentModel.mixed,
  }),
};

const ImageRenderer: CustomBlockRenderer = function ImageRenderer(props) {
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

  return (
    <HTML
      source={{ html }}
      tagsStyles={tagsStyles || defaultTagsStyles}
      contentWidth={width}
      renderers={renderers}
      customHTMLElementModels={customHTMLElementModels}
    />
  );
};

export default HTMLContent;
