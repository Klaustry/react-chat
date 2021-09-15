export default (state, action) => {
  switch (action.type) {
    case 'ENTERED':
      return {
        ...state,
        joined: true,
        user: action.payload.user,
        room: action.payload.room,
      };

    case 'SET_DATA':
      return {
        ...state,
        users: action.payload.users,
        messages: action.payload.messages,
      };

    case 'SET_USERS':
      return {
        ...state,
        users: action.payload,
      };

    case 'NEW_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    default:
      return state;
  }
};
