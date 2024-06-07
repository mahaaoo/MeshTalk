import { Account, AccountFields } from "../config/interface";

const reducer = (state: EditInfoState, action: EditInfoAction) => {
  switch (action.type) {
    case "init": {
      const account = action.payload as Account;
      console.log(state);
      console.log("init", account.source.fields);
      return {
        account,
        avatar: account.avatar,
        displayName: account.display_name,
        header: account.header,
        note: account.source.note,
        robot: account.bot,
        lock: account.locked,
        fields: account.source.fields,
      };
    }
    case "setItem": {
      return { ...state, ...action.payload };
    }
    case "setField": {
      const { index, name, value } = action.payload;
      const oldField = state.fields;
      oldField[index] = {
        ...oldField[index],
        name,
        value,
      };

      return { ...state, fields: oldField };
    }
    default:
      throw new Error();
  }
};

interface EditInfoState {
  avatar: string;
  displayName: string;
  account: Account;
  header: string;
  note: string;
  robot: boolean;
  lock: boolean;
  fields: AccountFields[];
}

interface EditInfoAction {
  type: string;
  payload: any;
}

const initialState = {
  avatar: "",
  displayName: "",
  account: undefined,
  header: "",
  note: "",
  robot: false,
  lock: false,
  fields: [],
};

const getRequestBody = (state: EditInfoState) => {
  const { avatar, displayName, header, note, robot, lock, fields } = state;
  const formData = new FormData();

  const avatarUriParts = avatar.split(".");
  const avatarFileType = avatarUriParts[avatarUriParts.length - 1];

  formData.append("avatar", {
    uri: avatar,
    name: `photo.${avatarFileType}`,
    type: `image/${avatarFileType}`,
  } as unknown as Blob);

  formData.append("display_name", displayName);
  formData.append("note", note);
  formData.append("bot", robot);
  formData.append("locked", lock);

  const headerUriParts = header.split(".");
  const headerFileType = headerUriParts[avatarUriParts.length - 1];

  formData.append("header", {
    uri: header,
    name: `photo.${headerFileType}`,
    type: `image/${headerFileType}`,
  } as unknown as Blob);

  if (fields.length > 0) {
    fields.forEach((field, index) => {
      const { name, value } = field;
      console.log({ name, value });
      formData.append(`fields_attributes[${index}][name]`, name);
      formData.append(`fields_attributes[${index}][value]`, value);
    });
  }
  return formData;
};

export { reducer, EditInfoState, EditInfoAction, initialState, getRequestBody };
