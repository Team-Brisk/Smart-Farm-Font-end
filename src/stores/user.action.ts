import { loginApi } from "@/api/auth";

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
