const initialState = {
  sourceSelectRows: [],
  targetSelectRows: [],
  rowSelectRows: {}
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
    case 'rowSelect':
      return {
        ...state,
        rowSelectRows: action?.payload
      };
    default:
      return state;
  }
}

export default selectReducer;
export { initialState };