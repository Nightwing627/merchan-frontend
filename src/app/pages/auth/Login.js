import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Formik } from "formik";
import { connect } from "react-redux";
import { injectIntl, FormattedMessage } from "react-intl";
import { TextField } from "@material-ui/core";
import clsx from "clsx";
import * as auth from "../../store/ducks/auth.duck";
import withStyles from "@material-ui/core/styles/withStyles";
import { toAbsoluteUrl } from "../../../_metronic/utils/utils";
const styles = {
  root: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#77778A",
      },
      "& input": {
        backgroundColor: "#2F2F42",
        color: "#fff",
      },
    },
  },
  input: {
    "& .MuiInputBase-root": {
      color: "white",
    },
    marginTop: 10,
  },
  label: {
    color: "white",
    fontSize: "16px !important",
    "&$focusedLabel": {
      color: "white",
      backgroundColor: "#2F2F42",
    },
    "&$erroredLabel": {
      color: "orange",
      backgroundColor: "#2F2F42",
    },
  },
  focusedLabel: {},
  erroredLabel: {},
  error: {},
};
function Login(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const [loadingButtonStyle, setLoadingButtonStyle] = useState({
    paddingRight: "2.5rem",
  });

  const enableLoading = () => {
    setLoading(true);
    setLoadingButtonStyle({ paddingRight: "3.5rem" });
  };

  const disableLoading = () => {
    setLoading(false);
    setLoadingButtonStyle({ paddingRight: "2.5rem" });
  };

  const _checkStatus = (response) => {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  };

  const { classes } = props;
  const API_URL = process.env.REACT_APP_API_URL;
  return (
    <>
      <div className="kt-login__head">
        <span className="kt-login__signup-label">
          Don't have an account yet?
        </span>
        &nbsp;&nbsp;
        <Link to="/auth/registration" className="kt-link kt-login__signup-link">
          Sign Up!
        </Link>
      </div>

      <div className="kt-login__body">
        <div className="kt-login__form">
          <div className="kt-login__title">
            <img
              className="kt-header__brand-logo-default"
              alt="logo"
              src={toAbsoluteUrl("/media/logos/logo-2.png")}
            />
          </div>

          <Formik
            initialValues={{
              email: "admin@demo.com",
              password: "demo",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.email) {
                // https://github.com/formatjs/react-intl/blob/master/docs/API.md#injection-api
                errors.email = intl.formatMessage({
                  id: "AUTH.VALIDATION.REQUIRED_FIELD",
                });
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = intl.formatMessage({
                  id: "AUTH.VALIDATION.INVALID_FIELD",
                });
              }

              if (!values.password) {
                errors.password = intl.formatMessage({
                  id: "AUTH.VALIDATION.REQUIRED_FIELD",
                });
              }

              return errors;
            }}
            onSubmit={(values, { setStatus, setSubmitting }) => {
              enableLoading();
              setTimeout(() => {
                const postBody = {
                  email: values.email,
                  password: values.password,
                };
                fetch(`${API_URL}/auth/login`, {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(postBody),
                })
                  .then(_checkStatus)
                  .then((res) => res.json())
                  .then((data) => {
                    disableLoading();
                    props.login(data.accessToken);
                  })
                  .catch(() => {
                    disableLoading();
                    setSubmitting(false);
                    setStatus(
                      intl.formatMessage({
                        id: "AUTH.VALIDATION.INVALID_LOGIN",
                      })
                    );
                  });
              }, 1000);
            }}
          >
            {({
              values,
              status,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form
                noValidate={true}
                autoComplete="off"
                className="kt-form"
                onSubmit={handleSubmit}
              >
                {status ? (
                  <div role="alert" className="alert alert-danger">
                    <div className="alert-text">{status}</div>
                  </div>
                ) : null}
                <div className="form-group">
                  <TextField
                    type="email"
                    label="E-mail"
                    margin="normal"
                    className={classes.root}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    variant="outlined"
                    helperText={touched.email && errors.email}
                    error={Boolean(touched.email && errors.email)}
                    InputLabelProps={{
                      classes: {
                        root: classes.label,
                        focused: classes.focusedLabel,
                        error: classes.erroredLabel,
                      },
                    }}
                    InputProps={{
                      className: classes.root,
                    }}
                  />
                </div>

                <div className="form-group" style={{ position: "relative" }}>
                  <Link
                    to="/auth/forgot-password"
                    className="kt-link kt-login__link-forgot"
                    style={{ position: "absolute", right: 0, top: 5 }}
                  >
                    <FormattedMessage id="AUTH.GENERAL.FORGOT_BUTTON" />
                  </Link>
                  <TextField
                    type="password"
                    margin="normal"
                    label="Password"
                    className={classes.root}
                    name="password"
                    variant="outlined"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    helperText={touched.password && errors.password}
                    error={Boolean(touched.password && errors.password)}
                    InputLabelProps={{
                      classes: {
                        root: classes.label,
                        focused: classes.focusedLabel,
                        error: classes.erroredLabel,
                      },
                    }}
                    InputProps={{
                      className: classes.input,
                    }}
                  />
                </div>

                <div
                  className="kt-login__actions"
                  style={{ justifyContent: "center" }}
                >
                  <button
                    id="kt_login_signin_submit"
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn btn-primary btn-elevate kt-login__btn-primary ${clsx(
                      {
                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": loading,
                      }
                    )}`}
                    style={loadingButtonStyle}
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default injectIntl(
  connect(null, auth.actions)(withStyles(styles)(Login))
);
