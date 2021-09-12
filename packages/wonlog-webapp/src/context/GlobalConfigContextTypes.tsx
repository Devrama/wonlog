// Action Type Enums
export enum GlobalConfigActionType {
  SET_CURRENT_STREAM_ID,
  ADD_STREAM_ID,
  SET_STREAM_PROPERTY_NAMES,
}

// Action Payloads
type GlobalConfigAddStreamIDPayload = string
type GlobalConfigSetCurrentStreamIDPayload = string

interface GlobalConfigStreamPropertyNamesPayload {
  [streamID: string]: string[]
}

// Action Declarations
interface GlobalConfigSetCurrentStreamIDAction {
  type: GlobalConfigActionType.SET_CURRENT_STREAM_ID
  payload: GlobalConfigSetCurrentStreamIDPayload
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
  | GlobalConfigAddStreamIDAction
  | GlobalConfigStreamPropertyNamesAction

export interface GlobalConfigState {
  currentStreamID?: string
  streamIDs: Set<GlobalConfigAddStreamIDPayload>
  streamPropertyNames: GlobalConfigStreamPropertyNamesPayload
}
