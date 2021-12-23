const initialState = {
  sourceSelectRows: [],
  targetSelectRows: []
}

function selectReducer(state: any, action: any) {
  switch (action.type) {
    case 'sourceSelect':
      return {
        ...state,
        sourceSelectRows: action?.payload
      };
    case 'targetSelect':
      return {
        ...state,
        targetSelectRows: action?.payload
      };
    default:
      return state;
  }
}

export default selectReducer;
export { initialState };