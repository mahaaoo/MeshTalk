import React, { useEffect } from "react";
import { View } from "react-native";

import { getMastodonServers } from "../../server/app";

interface RecommandProps {}

const Recommand: React.FC<RecommandProps> = (props) => {
  const {} = props;

  useEffect(() => {
    const fetch = async () => {
      const { data } = await getMastodonServers();
      console.log("12312313");
      console.log(data);
    };
    fetch();
  }, []);

  return <View />;
};

export default Recommand;
