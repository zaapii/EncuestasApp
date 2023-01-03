import { SET_USER } from "../actions/user.action"
import { LOGOUT_USER } from "../actions/user.action"

const initialState = {
  user: null,
}

const UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return {...state, user: action.user}
    case LOGOUT_USER:
      return {...state, user: null}
  }
  return state
}

export default UserReducer