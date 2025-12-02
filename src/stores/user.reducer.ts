const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
};

export default function userReducer(state = initialState, action: any) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}
