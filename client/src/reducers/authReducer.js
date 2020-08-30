const initState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  isLoading: false,
  usersLoading: false,
  user: null,
  users: null,
  fullyLoaded: false,
};

const authReducer = (state = initState, action) => {
  console.log(action);
  switch (action.type) {
    case 'USERS_LOADING':
      return {
        ...state,
        usersLoading: true,
      };
    case 'USERS_LOADED':
      return {
        ...state,
        users: action.payload,
        usersLoading: false,
      };
    case 'USER_LOADING':
      return {
        ...state,
        isLoading: true,
      };
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload,
        fullyLoaded: true,
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
        fullyLoaded: false,
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'LOGOUT_SUCCESS':
    case 'REGISTER_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        fullyLoaded: false,
      };
    default:
      return state;
  }
};
export default authReducer;
