import { Screen } from "@components";
import User from "@ui/user";
import DefaultUser from "@ui/user/defaultUser";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";

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
    };
    fetchUserData();
  }, [acct]);

  return (
    <Screen>
      {!userData ? (
        <DefaultUser />
      ) : (
        <User userData={userData} id={userData.id} />
      )}
    </Screen>
  );
};

export default Users;
