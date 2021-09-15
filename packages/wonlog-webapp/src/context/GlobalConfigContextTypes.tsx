// Action Type Enums
export enum GlobalConfigActionType {
  SET_CURRENT_STREAM_ID = 'SET_CURRENT_STREAM_ID',
  SET_SEARCH_KEYWORD = 'SET_SEARCH_KEYWORD',
  SET_SEARCH_MODE = 'SET_SEARCH_MODE',
  SET_DARKMODE = 'SET_DARKMODE',
  ADD_STREAM_ID = 'ADD_STREAM_ID',
  SET_STREAM_PROPERTY_NAMES = 'SET_STREAM_PROPERTY_NAMES',
}

// Action Payloads
type GlobalConfigSetCurrentStreamIDPayload = string
type GlobalConfigSetSearchKeywordPayload = string
export enum GlobalConfigSetSearchModePayload {
  TEXT = 'text',
  REGEX = 'regex',
}
export enum GlobalConfigSetDarkmodePayload {
  LIGHT = 'light',
  DARK = 'dark',
}
type GlobalConfigAddStreamIDPayload = string

interface GlobalConfigStreamPropertyNamesPayload {
  [streamID: string]: string[]
}

// Action Declarations
interface GlobalConfigSetCurrentStreamIDAction {
  type: GlobalConfigActionType.SET_CURRENT_STREAM_ID
  payload: GlobalConfigSetCurrentStreamIDPayload
}
interface GlobalConfigSetSearchKeywordAction {
  type: GlobalConfigActionType.SET_SEARCH_KEYWORD
  payload: GlobalConfigSetSearchKeywordPayload
}
interface GlobalConfigSetSearchModeAction {
  type: GlobalConfigActionType.SET_SEARCH_MODE
  payload: GlobalConfigSetSearchModePayload
}
interface GlobalConfigSetDarkmodeAction {
  type: GlobalConfigActionType.SET_DARKMODE
  payload: GlobalConfigSetDarkmodePayload
}
interface GlobalConfigAddStreamIDAction {
  type: GlobalConfigActionType.ADD_STREAM_ID
  payload: GlobalConfigAddStreamIDPayload
}
interface GlobalConfigStreamPropertyNamesAction {
  type: GlobalConfigActionType.SET_STREAM_PROPERTY_NAMES
  payload: GlobalConfigStreamPropertyNamesPayload
}

export type GlobalConfigAction =
  | GlobalConfigSetCurrentStreamIDAction
  | GlobalConfigSetSearchKeywordAction
  | GlobalConfigSetSearchModeAction
  | GlobalConfigSetDarkmodeAction
  | GlobalConfigAddStreamIDAction
  | GlobalConfigStreamPropertyNamesAction

export interface GlobalConfigState {
  currentStreamID?: GlobalConfigSetCurrentStreamIDPayload
  searchKeyword?: GlobalConfigSetSearchKeywordPayload
  searchMode: GlobalConfigSetSearchModePayload
  darkmode: GlobalConfigSetDarkmodePayload
  streamIDs: Set<GlobalConfigAddStreamIDPayload>
  streamPropertyNames: GlobalConfigStreamPropertyNamesPayload
}
