import { SET_EMAILS } from "../actions/email.action"

const initialState = {
  emails: [],
}

const EmailReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EMAILS:
      return {...state, emails: action.emails}
  }
  return state
}

export default EmailReducer