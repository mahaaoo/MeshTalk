import React from "react";
import { ModalUtil, UniqueModal } from "react-native-ma-modal";
import { MeasuredDimensions } from "react-native-reanimated";

import { PopOptionsContainer } from "./PopOptionsContainer";
import { POPMODALID } from "../../config/constant";
import PopOptions, { PopOptionsProps } from "./PopOptions";

export const PopOptonsUtil: UniqueModal = {
  key: POPMODALID,
  template: (measurement: MeasuredDimensions, params: PopOptionsProps) => {
    return (
      <PopOptionsContainer
        duration={200}
        mask={false}
        measurement={measurement}
      >
        <PopOptions {...{ ...params }} />
      </PopOptionsContainer>
    );
  },
  show: (measurement: MeasuredDimensions, params: PopOptionsProps) => {
    ModalUtil.add(
      PopOptonsUtil.template(measurement, params),
      PopOptonsUtil.key,
    );
  },
  hide: () => ModalUtil.remove(PopOptonsUtil.key || ""),
  isExist: () => ModalUtil.isExist(PopOptonsUtil.key || "") || false,
};
