import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Loading } from "react-native-ma-modal";

import { Account } from "../../config/interface";
import { lookupAcct } from "../../server/account";

import User from "@/ui/user";

const Users: React.FC<object> = () => {
  const { id, acct } = useLocalSearchParams<{ id: string; acct: string }>();
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
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <User userData={userData} id={id} />
    </>
  );
};

export default Users;
