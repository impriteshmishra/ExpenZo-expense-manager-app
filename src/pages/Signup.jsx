import React from 'react'
import SignupSignin from '../components/SignupSignin/indexSignup'
import Welcome from '../components/Welcome/Welcome';


function Signup() {
  return (
    <div>
       <div className="wrapper">
        <Welcome/>
        <SignupSignin/>
      </div>
    </div>
  )
}

export default Signup
