export const SET_USER = 'SET_USER'
export const LOGOUT_USER = 'LOGOUT_USER'
export const SIGNUP = 'SIGNUP'
import { URL_AUTH_SIGNUP } from "../../constants/Database"

export const signUp = (email, password) => {
  return async (dispatch) => {
    try {
      const response = await fetch(URL_AUTH_SIGNUP, {
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true
          }),
        })
        const data = await response.json()
        dispatch({
          type: SIGNUP
        })
    } catch (error) {
      console.log(error)
    }
  }
}

export const setUser = (user) => ({
  user,
  type: SET_USER
})

export const logoutUser = () => ({
  type: LOGOUT_USER
})