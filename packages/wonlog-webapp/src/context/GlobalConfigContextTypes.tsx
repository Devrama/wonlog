// Action Type Enums
export enum GlobalConfigActionType {
  SET_CURRENT_STREAM_ID,
  SET_SEARCH_KEYWORD,
  SET_DARKMODE,
  ADD_STREAM_ID,
  SET_STREAM_PROPERTY_NAMES,
}

// Action Payloads
type GlobalConfigSetCurrentStreamIDPayload = string
type GlobalConfigSetSearchKeywordPayload = string
type GlobalConfigSetDarkmodePayload = 'light' | 'dark'
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
  | GlobalConfigSetDarkmodeAction
  | GlobalConfigAddStreamIDAction
  | GlobalConfigAddStreamIDAction
  | GlobalConfigStreamPropertyNamesAction

export interface GlobalConfigState {
  currentStreamID?: GlobalConfigSetCurrentStreamIDPayload
  searchKeyword?: GlobalConfigSetSearchKeywordPayload
  darkmode: GlobalConfigSetDarkmodePayload
  streamIDs: Set<GlobalConfigAddStreamIDPayload>
  streamPropertyNames: GlobalConfigStreamPropertyNamesPayload
}
