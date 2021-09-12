import React, { useReducer, FunctionComponent, useContext, Dispatch, ReducerAction } from 'react';
import {
  GlobalConfigActionType,
  GlobalConfigAction,
  GlobalConfigState,
} from './GlobalConfigContextTypes';

const initialState: GlobalConfigState = {
  currentStreamID: undefined,
  streamIDs: new Set(),
  streamPropertyNames: {},
};

const globalConfigReducer = (state: GlobalConfigState, action: GlobalConfigAction): GlobalConfigState => {
  switch (action.type) {
    case GlobalConfigActionType.SET_CURRENT_STREAM_ID:
      return {
        ...state,
        currentStreamID: action.payload,
      };
    case GlobalConfigActionType.ADD_STREAM_ID:

      state.streamIDs.add(action.payload);

      return {
        ...state,
        streamIDs: state.streamIDs,
      };
    case GlobalConfigActionType.SET_STREAM_PROPERTY_NAMES:
      return {
        ...state,
        streamPropertyNames: action.payload,
      };
    default:
      throw new Error('Unexpected action');
  }
};

const GlobalConfigContext = React.createContext({
  state: initialState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dispatch: (action: GlobalConfigAction) => {
    // Set by a reducer below
  },
});

const GlobalConfigProvider: FunctionComponent = ({ children }) => {
  const [state, dispatch] = useReducer(globalConfigReducer, initialState);
  return (
    <GlobalConfigContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalConfigContext.Provider>
  );
};

const useGlobalConfig = (): {
  globalConfig: GlobalConfigState
  setGlobalConfig: Dispatch<ReducerAction<typeof globalConfigReducer>>
} => {
  const { state, dispatch } = useContext(GlobalConfigContext);
  return {
    globalConfig: state,
    setGlobalConfig: dispatch,
  };
};

export { GlobalConfigContext, GlobalConfigProvider, useGlobalConfig, GlobalConfigActionType };
