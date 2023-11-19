// ** React Imports
import { Fragment, useState } from "react"

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Button,
  CardBody,
  CardTitle,
  ModalBody,
  CardHeader,
} from "reactstrap"

// ** Third Party Components
import "cleave.js/dist/addons/cleave-phone.us"
import axios from "axios"
import { startRegistration } from "@simplewebauthn/browser"


const PasswordlessAuth = () => {
  const [hasQuickLoginInLocalStorage, setHasQuickLoginInLocalStorage] = useState(!!localStorage.getItem("quickLogin"))
  const handleEnableQuickLogin = async () => {
    const { data } = await axios.get("/webauthn/generate-registration-options")
    console.log(data)
    try {
      const attResp = await startRegistration(data)
      console.log(attResp)
      const { data: verifyRegistrationResp } = await axios.post(
        "/webauthn/verify-registration",
        attResp
      )
      console.log(verifyRegistrationResp)
      // store in local storage an object containing { id, name } of the user
      const userData = JSON.parse(localStorage.getItem("userData"))
      localStorage.setItem(
        "quickLogin",
        JSON.stringify({
          id: userData.id,
          name: userData.name
        })
      )
      setHasQuickLoginInLocalStorage(true)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const handleRemoveAllRegisteredDevices = async () => {
    axios.post("/webauthn/devices/drop-all").then((res) => {
      console.log(res)
      localStorage.removeItem("quickLogin")
      setHasQuickLoginInLocalStorage(false)
    })
  }

  const ToggleButton = () => {
    if (!hasQuickLoginInLocalStorage) {
      return (
        <Button color="primary" onClick={handleEnableQuickLogin}>
          Enable Passwordless (™️) authentication
        </Button>
      )
    } else {
      return (
        <Button color="danger" onClick={handleRemoveAllRegisteredDevices}>
          Remove all registered devices
        </Button>
      )
    }
  }

  return (
    <Fragment>
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Passwordless Authentication (™️)</CardTitle>
        </CardHeader>
        <CardBody className="my-2 py-25">
          <p className="fw-bolder">Passwordless Authentication (™️) protects your data more than any other
            technology</p>
          <p>
            Start by clicking the button below and following the instructions on your device. You will be able to use
            this
            device to log in to your account without a password (Quick Sign In).
          </p>
          <ToggleButton/>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default PasswordlessAuth
