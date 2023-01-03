import {call, put} from "redux-saga/effects"
import axios from "../../../axios/axios"
import {requestingActions} from "../slice/requestingSlice"

const makeRequestAsync = async (data) => {
  return axios.post('/inventory/request', data).then(res => res.data)
}

export default function* callRequestStockSaga({payload}) {
  try {
    yield call(makeRequestAsync(), payload.data)
    yield put(requestingActions.makeRequestSuccess())
  } catch (e) {
    console.error(e)
    yield put(requestingActions.makeRequestFailure())
  }
}