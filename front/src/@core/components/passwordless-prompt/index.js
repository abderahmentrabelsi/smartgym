import axios from "axios";
import { startAuthentication } from "@simplewebauthn/browser";
import { Button } from "reactstrap";
import { ArrowRight, Mail } from "react-feather";
import { useState } from "react";

export const PasswordlessPrompt = ({ callback }) => {
  const [quickLogin, setQuickLogin] = useState(() => {
    try {
      const quickLogin = localStorage.getItem("quickLogin");
      if (!quickLogin) {
        return null;
      }
      return JSON.parse(quickLogin);
    } catch (e) {
      alert(`Error: ${e}`);
    }
  });

  const handlePasswordlessLoginRequest = async () => {
    try {
      const { data: authOptions } = await axios.get(
        `/webauthn/generate-authentication-options?uid=${quickLogin.id}`
      );
      const webauthnResponse = await startAuthentication(authOptions);
      const { data: verificationResp } = await axios.post(
        `/webauthn/verify-authentication?uid=${quickLogin.id}`,
        webauthnResponse
      );
      callback(verificationResp);
    } catch (e) {
      alert(`Error: ${e}`);
    }
  };
  if (quickLogin === null) return null;
  return (
    <Button.Ripple
      color="green"
      block
      className={"mt-1"}
      onClick={handlePasswordlessLoginRequest}
    >
      <ArrowRight size={18} className={"mr-1"} />
      <span className="align-middle ml-25">
        Quick login as {quickLogin.name}
      </span>
    </Button.Ripple>
  );
};
