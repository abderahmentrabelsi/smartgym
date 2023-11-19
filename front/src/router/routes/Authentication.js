// ** React Imports
import { lazy } from "react";

const Login = lazy(() => import("../../views/pages/authentication/Login"));
const LoginBasic = lazy(() =>
  import("../../views/pages/authentication/LoginBasic")
);
const LoginCover = lazy(() =>
  import("../../views/pages/authentication/LoginCover")
);

const Register = lazy(() =>
  import("../../views/pages/authentication/Register")
);
const RegisterBasic = lazy(() =>
  import("../../views/pages/authentication/RegisterBasic")
);
const RegisterCover = lazy(() =>
  import("../../views/pages/authentication/RegisterCover")
);
const RegisterMultiSteps = lazy(() =>
  import("../../views/pages/authentication/register-multi-steps")
);

const ForgotPassword = lazy(() =>
  import("../../views/pages/authentication/ForgotPassword")
);
const ForgotPasswordBasic = lazy(() =>
  import("../../views/pages/authentication/ForgotPasswordBasic")
);
const ForgotPasswordCover = lazy(() =>
  import("../../views/pages/authentication/ForgotPasswordCover")
);

const ResetPasswordBasic = lazy(() =>
  import("../../views/pages/authentication/ResetPasswordBasic")
);
const ResetPasswordCover = lazy(() =>
  import("../../views/pages/authentication/ResetPasswordCover")
);

const VerifyEmailBasic = lazy(() =>
  import("../../views/pages/authentication/VerifyEmailBasic")
);
const VerifyEmailCover = lazy(() =>
  import("../../views/pages/authentication/VerifyEmailCover")
);

const VerifiedEmailCover = lazy(() =>
  import("../../views/pages/authentication/VerifiedEmailCover")
);

const TwoStepsBasic = lazy(() =>
  import("../../views/pages/authentication/TwoStepsBasic")
);
const TwoStepsCover = lazy(() =>
  import("../../views/pages/authentication/TwoStepsCover")
);

const AuthenticationRoutes = [
  {
    path: "/login",
    element: <Login />,
    meta: {
      layout: "blank",
      publicRoute: true,
      restricted: true,
    },
  },
  {
    path: "/exercises/login-basic",
    element: <LoginBasic />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/exercises/login-cover",
    element: <LoginCover />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/register",
    element: <Register />,
    meta: {
      layout: "blank",
      publicRoute: true,
      restricted: true,
    },
  },
  {
    path: "/exercises/register-basic",
    element: <RegisterBasic />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/exercises/register-cover",
    element: <RegisterCover />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/exercises/register-multi-steps",
    element: <RegisterMultiSteps />,
    meta: {
      layout: "blank",
    },
  },

  {
    path: "/forgot-password",
    element: <ForgotPassword />,
    layout: "BlankLayout",
    meta: {
      layout: "blank",
      publicRoute: true,
      restricted: true,
    },
  },
  {
    path: "/exercises/forgot-password-basic",
    element: <ForgotPasswordBasic />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/exercises/forgot-password-cover",
    element: <ForgotPasswordCover />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/reset-password",
    element: <ResetPasswordCover />,
    meta: {
      layout: "blank",
      publicRoute: true,
      restricted: true,
    },
  },
  {
    path: "/exercises/reset-password-basic",
    element: <ResetPasswordBasic />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/exercises/reset-password-cover",
    element: <ResetPasswordCover />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/verify-email",
    element: <VerifyEmailCover />,
    meta: {
      layout: "blank",
      publicRoute: true,
      restricted: true,
    },
  },
  {
    path: "/activate-email",
    element: <VerifiedEmailCover />,
    meta: {
      layout: "blank",
      publicRoute: true,
    },
  },
  {
    path: "/exercises/verify-email-basic",
    element: <VerifyEmailBasic />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/exercises/verify-email-cover",
    element: <VerifyEmailCover />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/exercises/two-steps-basic",
    element: <TwoStepsBasic />,
    meta: {
      layout: "blank",
    },
  },
  {
    path: "/exercises/two-steps-cover",
    element: <TwoStepsCover />,
    meta: {
      layout: "blank",
    },
  },
];

export default AuthenticationRoutes;
