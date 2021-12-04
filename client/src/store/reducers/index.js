import { combineReducers } from "redux";

const userReducer = async (state = null, action) => {
  switch (action.type) {
    case "LOG_IN":
      return action.payload;
    case "LOG_OUT":
      // await axios.get("/auth/logout");
      return 11;
    default:
      return state;
  }
};

const togglePopReducer = (state = false, action) => {
  switch (action.type) {
    case "OPEN":
      return true;
    case "CLOSE":
      return false;
    default:
      return state;
  }
};

const activePageReducer = (
  state = [false, false, false, false, false],
  action
) => {
  switch (action.type) {
    case "SET_ACTIVE":
      state = Array(5).fill(false);
      state[action.payload] = true;
      return state;
    default:
      return state;
  }
};

const allReducers = combineReducers({
  user: userReducer,
  togglePop: togglePopReducer,
  activePages: activePageReducer,
});

export default allReducers;
