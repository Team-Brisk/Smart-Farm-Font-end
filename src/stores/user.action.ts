import { loginApi } from "@/api/auth";
import { apiLogout } from "@/api/user.api";

import type { Dispatch } from '@reduxjs/toolkit';
import { setUserItem } from "./user.store";
export const loginAsync = (payload: any) => async (dispatch: any) => {
  const { ok, data } = await loginApi(payload);

  if (!ok) {
    alert(data.message);
    return null;
  }

  localStorage.setItem("token", data.token);

  dispatch({
    type: "LOGIN_SUCCESS",
    payload: data.user,
  });

  return data;
};

export const logoutAsync = () => {
  return async (dispatch: Dispatch) => {
    const { status } = await apiLogout({ token: localStorage.getItem('t')! });

    if (status) {
      localStorage.clear();
      dispatch(
        setUserItem({
          logged: false,
        }),
      );

      return true;
    }

    return false;
  };
};
