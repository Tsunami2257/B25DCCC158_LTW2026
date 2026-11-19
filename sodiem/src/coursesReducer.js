export const coursesReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD':
      return [...action.payload];
    case 'ADD': {
      const maxId = state.reduce((max, c) => (c.id > max ? c.id : max), 0);
      return [...state, { ...action.payload, id: maxId + 1 }];
    }
    case 'REMOVE':
      return state.filter((c) => c.id !== action.payload);
    case 'SET_SCORE': {
      const { id, score } = action.payload;
      return state.map((c) => (c.id === id ? { ...c, score } : c));
    }
    default:
      return state;
  }
};