import { Screen } from "@components";
import User from "@ui/user";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Loading } from "react-native-ma-modal";

import { Account } from "../../config/interface";
import { lookupAcct } from "../../server/account";

const Users: React.FC<object> = () => {
  const { acct = "" } = useLocalSearchParams<{
    acct: string;
  }>();
  const [userData, setUserData] = useState<Account>();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, ok } = await lookupAcct(acct);
      if (ok && data) {
        setUserData(data);
      }
      Loading.hide();
    };
    Loading.show();
    fetchUserData();
  }, [acct]);

  return (
    <Screen>
      {
        !userData ? <View style={styles.main} /> : <User userData={userData} id={userData.id} />
      }
    </Screen>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  }
})

export default Users;
