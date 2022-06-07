import React from "react";
import { Formik } from "formik";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import { FormattedMessage, injectIntl } from "react-intl";
import { Checkbox, FormControlLabel, TextField } from "@material-ui/core";
import * as auth from "../../store/ducks/auth.duck";

const styles = {
  label: {
    color: "white",
    "&$focusedLabel": {
      color: "white"
    },
    "&$erroredLabel": {
      color: "orange"
    }
  },
  focusedLabel: {},
  erroredLabel: {},
  error: {},
  input: {
    color: "white",
    marginTop: 10
  }
};

function Registration(props) {
  const { intl } = props;
  const { classes } = props;
  const _checkStatus = response => {
    // raises an error in case response status is not a success
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  };
  const API_URL = process.env.REACT_APP_API_URL;
  return (
    <div className="kt-login__body">
      <div className="kt-login__form">
        <div className="kt-login__title">
          <h3>
            <FormattedMessage id="AUTH.REGISTER.TITLE" />
          </h3>
        </div>

        <Formik
          initialValues={{
            email: "",
            fullname: "",
            username: "",
            password: "",
            acceptTerms: true,
            confirmPassword: ""
          }}
          validate={values => {
            const errors = {};

            if (!values.email) {
              errors.email = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
              });
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = intl.formatMessage({
                id: "AUTH.VALIDATION.INVALID_FIELD"
              });
            }

            if (!values.fullname) {
              errors.fullname = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
              });
            }

            if (!values.username) {
              errors.username = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
              });
            }

            if (!values.password) {
              errors.password = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
              });
            }

            if (!values.confirmPassword) {
              errors.confirmPassword = intl.formatMessage({
                id: "AUTH.VALIDATION.REQUIRED_FIELD"
              });
            } else if (values.password !== values.confirmPassword) {
              errors.confirmPassword =
                "Password and Confirm Password didn't match.";
            }

            if (!values.acceptTerms) {
              errors.acceptTerms = "Accept Terms";
            }

            return errors;
          }}
          onSubmit={(values, { setStatus, setSubmitting }) => {
            const postBody = {
              username: values.username,
              email: values.email,
              password: values.password
            };
            fetch(`${API_URL}/auth/register`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              body: JSON.stringify(postBody)
            })
              .then(_checkStatus)
              .then(res => res.json())
              .then(data => {
                console.log("data:", data);
                if (data.accessToken) {
                  props.register(data.accessToken);
                } else {
                  if (data.status === 400) {
                    setStatus(
                      intl.formatMessage({
                        id: "AUTH.VALIDATION.USER_ALREADY_EXIST"
                      })
                    );
                  }
                }
              })
              .catch(() => {
                setSubmitting(false);
                setStatus(
                  intl.formatMessage({
                    id: "AUTH.VALIDATION.INVALID_LOGIN"
                  })
                );
              });
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
            isSubmitting
          }) => (
            <form onSubmit={handleSubmit} noValidate autoComplete="off">
              {status && (
                <div role="alert" className="alert alert-danger">
                  <div className="alert-text">{status}</div>
                </div>
              )}

              <div className="form-group mb-0">
                <TextField
                  margin="normal"
                  label="Fullname"
                  className="kt-width-full"
                  name="fullname"
                  variant="outlined"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.fullname}
                  helperText={touched.fullname && errors.fullname}
                  error={Boolean(touched.fullname && errors.fullname)}
                  InputLabelProps={{
                    classes: {
                      root: classes.label,
                      focused: classes.focusedLabel,
                      error: classes.erroredLabel
                    }
                  }}
                  InputProps={{
                    className: classes.input
                  }}
                />
              </div>

              <div className="form-group mb-0">
                <TextField
                  label="Email"
                  margin="normal"
                  className="kt-width-full"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                  helperText={touched.email && errors.email}
                  error={Boolean(touched.email && errors.email)}
                  variant="outlined"
                  InputLabelProps={{
                    classes: {
                      root: classes.label,
                      focused: classes.focusedLabel,
                      error: classes.erroredLabel
                    }
                  }}
                  InputProps={{
                    className: classes.input
                  }}
                />
              </div>

              <div className="form-group mb-0">
                <TextField
                  margin="normal"
                  label="Username"
                  className="kt-width-full"
                  name="username"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  helperText={touched.username && errors.username}
                  error={Boolean(touched.username && errors.username)}
                  variant="outlined"
                  InputLabelProps={{
                    classes: {
                      root: classes.label,
                      focused: classes.focusedLabel,
                      error: classes.erroredLabel
                    }
                  }}
                  InputProps={{
                    className: classes.input
                  }}
                />
              </div>

              <div className="form-group mb-0">
                <TextField
                  type="password"
                  margin="normal"
                  label="Password"
                  className="kt-width-full"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  helperText={touched.password && errors.password}
                  error={Boolean(touched.password && errors.password)}
                  variant="outlined"
                  InputLabelProps={{
                    classes: {
                      root: classes.label,
                      focused: classes.focusedLabel,
                      error: classes.erroredLabel
                    }
                  }}
                  InputProps={{
                    className: classes.input
                  }}
                />
              </div>

              <div className="form-group">
                <TextField
                  type="password"
                  margin="normal"
                  label="Confirm Password"
                  className="kt-width-full"
                  name="confirmPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.confirmPassword}
                  helperText={touched.confirmPassword && errors.confirmPassword}
                  error={Boolean(
                    touched.confirmPassword && errors.confirmPassword
                  )}
                  variant="outlined"
                  InputLabelProps={{
                    classes: {
                      root: classes.label,
                      focused: classes.focusedLabel,
                      error: classes.erroredLabel
                    }
                  }}
                  InputProps={{
                    className: classes.input
                  }}
                />
              </div>

              <div className="form-group mb-0">
                <FormControlLabel
                  label={
                    <>
                      I agree the{" "}
                      <Link
                        to="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms & Conditions
                      </Link>
                    </>
                  }
                  control={
                    <Checkbox
                      color="primary"
                      name="acceptTerms"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      checked={values.acceptTerms}
                    />
                  }
                />
              </div>

              <div className="kt-login__actions">
                <Link
                  to="/auth/forgot-password"
                  className="kt-link kt-login__link-forgot"
                >
                  <FormattedMessage id="AUTH.GENERAL.FORGOT_BUTTON" />
                </Link>

                <Link to="/auth">
                  <button
                    type="button"
                    className="btn btn-secondary btn-elevate kt-login__btn-secondary"
                  >
                    Back
                  </button>
                </Link>

                <button
                  disabled={isSubmitting || !values.acceptTerms}
                  className="btn btn-primary btn-elevate kt-login__btn-primary"
                >
                  Submit
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default injectIntl(
  connect(null, auth.actions)(withStyles(styles)(Registration))
);
