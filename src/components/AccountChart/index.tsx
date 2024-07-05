import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Svg, { Polyline } from "react-native-svg";
import { HashTagHistory } from "../../config/interface";

interface AccountChartProps {
  history: HashTagHistory[];
}

const CHART_WIDTH = 70;
const CHART_HEIGHT = 50;

const AccountChart: React.FC<AccountChartProps> = (props) => {
  const { history } = props;
  const [path, setPath] = useState<string>("");

  useEffect(() => {
    const length = history.length;
    const stepX = CHART_WIDTH / (length - 1);
    let maxY = 0;

    history.forEach((h) => {
      const { accounts } = h;
      maxY = Math.max(parseInt(accounts), maxY);
    });

    if (maxY > 0) {
      const stepY = (CHART_HEIGHT - 10) / maxY;

      let point = "";

      history.reverse().forEach((h, index) => {
        const { accounts } = h;
        point += `${stepX * index},${CHART_HEIGHT - 5 - parseInt(accounts) * stepY} `;
      });
      setPath(point);
    }
  }, [history]);

  if (path.length === 0) {
    return <View style={{ width: CHART_WIDTH, height: CHART_HEIGHT }} />;
  }

  return (
    <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
      <Polyline
        points={path}
        stroke="#CC8030"
        strokeWidth="3"
        fill={"transparent"}
      />
      <Polyline
        points={`0,${CHART_HEIGHT} ${path} ${CHART_WIDTH},${CHART_HEIGHT}`}
        fill={"#EBDCCD"}
        opacity={0.7}
      />
    </Svg>
  );
};

export default AccountChart;
