import axios from "axios";

// export const login = () => async (dispatch) => {
//   await axios.get("http://localhost:5000/auth/google/callback");
//   const res = await axios.get("http://localhost:5000/auth/user");
//   dispatch({
//     type: "LOG_IN",
//     payload: res.data,
//   });
// };

export const getUser = () => {
  return {
    type: "GET_USER",
  };
};

export const logout = () => {
  return {
    type: "LOG_OUT",
  };
};

export const openPopUp = () => {
  return {
    type: "OPEN",
  };
};

export const closePopUp = () => {
  return {
    type: "CLOSE",
  };
};

export const setActivePage = (pageIndex) => {
  return {
    type: "SET_ACTIVE",
    payload: pageIndex,
  };
};
