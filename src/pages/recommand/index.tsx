import React, { useEffect } from "react";
import { View } from "react-native";

import { getMastodonServers } from "../../server/app";

interface RecommandProps {}

const Recommand: React.FC<RecommandProps> = (props) => {
  const {} = props;

  useEffect(async () => {
    const data = await getMastodonServers();
    console.log("12312313");
    console.log(data);
  }, []);

  return <View />;
};

export default Recommand;
