// Action Type Enums
export enum GlobalConfigActionType {
  SET_CURRENT_STREAM_ID = 'SET_CURRENT_STREAM_ID',
  SET_SEARCH_KEYWORD = 'SET_SEARCH_KEYWORD',
  SET_SEARCH_MODE = 'SET_SEARCH_MODE',
  SET_DARKMODE = 'SET_DARKMODE',
  SET_LOG_SORTING = 'SET_LOG_SORTING',
  ADD_STREAM_ID = 'ADD_STREAM_ID',
  SET_LOG_BUFFER_SIZE = 'SER_BUFFER_SIZE',
  SET_STREAM_PROPERTY_NAMES = 'SET_STREAM_PROPERTY_NAMES',
}

// Action Payloads
type GlobalConfigSetCurrentStreamIDPayload = string
type GlobalConfigSetSearchKeywordPayload = string
export enum GlobalConfigSetSearchModePayload {
  TEXT = 'text',
  REGEX = 'regex',
}
export enum GlobalConfigSetLogSortingPayload {
  DESC = 'desc',
  ASC = 'asc',
}
type GlobalConfigAddStreamIDPayload = string
type GlobalConfigSetLogBufferSizePayload = number

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
interface GlobalConfigSetLogSortingAction {
  type: GlobalConfigActionType.SET_LOG_SORTING
  payload: GlobalConfigSetLogSortingPayload
}
interface GlobalConfigAddStreamIDAction {
  type: GlobalConfigActionType.ADD_STREAM_ID
  payload: GlobalConfigAddStreamIDPayload
}
interface GlobalConfigSetLogBufferSizeAction {
  type: GlobalConfigActionType.SET_LOG_BUFFER_SIZE
  payload: GlobalConfigSetLogBufferSizePayload
}
interface GlobalConfigStreamPropertyNamesAction {
  type: GlobalConfigActionType.SET_STREAM_PROPERTY_NAMES
  payload: GlobalConfigStreamPropertyNamesPayload
}

export type GlobalConfigAction =
  | GlobalConfigSetCurrentStreamIDAction
  | GlobalConfigSetSearchKeywordAction
  | GlobalConfigSetSearchModeAction
  | GlobalConfigSetLogSortingAction
  | GlobalConfigAddStreamIDAction
  | GlobalConfigSetLogBufferSizeAction
  | GlobalConfigStreamPropertyNamesAction

export interface GlobalConfigState {
  currentStreamID?: GlobalConfigSetCurrentStreamIDPayload
  searchKeyword?: GlobalConfigSetSearchKeywordPayload
  searchMode: GlobalConfigSetSearchModePayload
  logSorting: GlobalConfigSetLogSortingPayload
  streamIDs: GlobalConfigAddStreamIDPayload[]
  logBufferSize: GlobalConfigSetLogBufferSizePayload
  streamPropertyNames: GlobalConfigStreamPropertyNamesPayload
}
