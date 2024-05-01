import { createNavigationContainerRef } from "@react-navigation/native";

import { StackParams } from "../pages";

export const navigationRef = createNavigationContainerRef();

export const navigate = (
  name: keyof StackParams,
  params?: object | undefined,
) => {
  console.log("navigate to", name);
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
};

export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}

export function reset(name: string, params?: any) {
  navigationRef?.reset({
    index: 0,
    routes: [{ name, params }],
  });
}
