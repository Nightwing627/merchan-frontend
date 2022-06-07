import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { compose } from "redux";
// eslint-disable-next-line no-restricted-imports
import { withStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import MaterialTable, { MTableEditRow } from "material-table";
import { Formik, Field, getIn } from "formik";
import InputMask from "react-input-mask";

import { makeSelectPartners } from "../../../index/selectors";
import { fetchAllPartnersApi } from "../../../index/api";

import { setPartners } from "../../../index/actions";

const useStyles = () => ({
  root: {
    display: "flex",
  },
  avatarImg: {
    borderRadius: 10,
    width: 150,
    height: 150,
    margin: 10,
  },
  input: {
    display: "none",
  },
});

class PartnerPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        {
          title: "CNPJ",
          field: "companyNumber",
        },
        {
          title: "Company Name",
          field: "companyName",
        },
      ],
    };
  }

  componentDidMount = async () => {
    const { partners, onSetPartners } = this.props;
    if (partners.length === 0) {
      const partners = await fetchAllPartnersApi();
      onSetPartners(partners);
    }
  };

  getMatchedCompanyNameByCompanyNumber = (currentCompanyNumber) => {
    const { partners } = this.props;
    if (partners.length !== 0) {
      const companyNumbers = partners.map((partner) => partner.companyNumber);
      const currentCompanyNumberIndex = companyNumbers.findIndex(
        (companyNumber) => companyNumber === currentCompanyNumber
      );
      if (currentCompanyNumberIndex !== -1) {
        return partners[currentCompanyNumberIndex].companyName;
      } else {
        return "";
      }
    } else {
      return "";
    }
  };

  handleCompanyNumberChange(event, setFieldValue, errors) {
    const value = event.target ? event.target.value : event;
    if (value) {
      const { partners } = this.props;
      const existedPartners =
        partners && partners.find((p) => p.companyNumber === value);
      if (existedPartners) {
        setFieldValue("companyName", existedPartners.companyName);
      } else if (Object.keys(errors).length === 0) {
        setFieldValue("companyName", "");
      }
    }
  }

  render() {
    const { columns } = this.state;
    const { partnerPageState, handleChangePartner } = this.props;
    const { partners = [] } = partnerPageState;
    const FormikMTInput = (props) => {
      return (
        <Field name={props.columnDef.field}>
          {({ field, form }) => {
            const { name } = field;
            const { errors, setFieldValue, values } = form;
            const showError = !!getIn(errors, name);
            if (name === "companyNumber") {
              return (
                <div>
                  <InputMask
                    mask="99.999.999/9999-99"
                    disabled={false}
                    value={props.value || ""}
                    maskChar=" "
                    onChange={(e) => {
                      setFieldValue(name, e.target.value);
                      props.onChange(e.target.value);
                    }}
                    onBlur={(e) =>
                      this.handleCompanyNumberChange(e, setFieldValue, errors)
                    }
                  >
                    {() => (
                      <TextField
                        type="text"
                        label="CNPJ"
                        variant="outlined"
                        error={showError}
                      />
                    )}
                  </InputMask>
                  {errors[field.name] && <div>{errors[field.name]}</div>}
                </div>
              );
            } else {
              return (
                <div>
                  <TextField
                    type="text"
                    label="CompanyName"
                    variant="outlined"
                    value={values.companyName || ""}
                    error={showError}
                    onChange={(e) => {
                      props.onChange(e.target.value);
                      setFieldValue(name, e.target.value);
                    }}
                  />
                  {errors[field.name] && <div>{errors[field.name]}</div>}
                </div>
              );
            }
          }}
        </Field>
      );
    };
    const MuiTableEditRow = ({ onEditingApproved, ...props }) => {
      return (
        <Formik
          enableReinitialize
          validate={(values) => {
            const errors = {};
            if (!values) return {};
            if (!values.companyNumber) {
              errors.companyNumber = "Required";
            }
            let companyNumberRGEX = /^[0-9]{2}[.][0-9]{3}[.][0-9]{3}[/][0-9]{4}[-][0-9]{2}$/;
            let regResult = companyNumberRGEX.test(values.companyNumber);
            if (regResult === false) {
              errors.companyNumber = "Invalid CNPJ format!";
            }
            if (!values.companyName) {
              errors.companyName = "Required";
            }
            return errors;
          }}
          initialValues={props.data ? props.data : { id: 0 }}
          onSubmit={(values) => {
            if (values) {
              if (values.companyNumber) {
                if (
                  props.mode === "update" &&
                  (props.data.companyName !== values.companyName ||
                    props.data.companyNumber !== values.companyNumber)
                )
                  delete values.tableData;
                onEditingApproved(props.mode, values, props.data);
              }
            }
          }}
        >
          {({ submitForm }) => (
            <MTableEditRow {...props} onEditingApproved={submitForm} />
          )}
        </Formik>
      );
    };
    return (
      <div className="col-md-8 ">
        <div className="kt-section">
          <span className="kt-section__sub">
            <div className="row" style={{ padding: "0 30px" }}>
              <span style={{ fontSize: 18, fontWeight: "bold" }}>
                PartnerPage
              </span>
              <p>
                It should allow the administrator to add/remove a partner at any
                time, so they can be shown in contracts as ASSIGNORS.
              </p>
            </div>
            <div className="row">
              <div className="col-md-12">
                <MaterialTable
                  title="Partners"
                  columns={columns}
                  data={partners}
                  options={{
                    actionsColumnIndex: -1,
                    search: false,
                    sorting: true,
                  }}
                  components={{
                    EditRow: MuiTableEditRow,
                    EditField: FormikMTInput,
                  }}
                  name="partners"
                  editable={{
                    onRowAdd: (newData) =>
                      new Promise((resolve) => {
                        setTimeout(() => {
                          handleChangePartner("Add", newData);
                          resolve();
                        }, 600);
                      }),
                    onRowUpdate: (newData, oldData) =>
                      new Promise((resolve) => {
                        setTimeout(() => {
                          if (oldData) {
                            handleChangePartner("Update", newData, oldData);
                          }
                          resolve();
                        }, 600);
                      }),

                    onRowDelete: (oldData) =>
                      new Promise((resolve) => {
                        setTimeout(() => {
                          handleChangePartner("Delete", null, oldData);
                          resolve();
                        }, 600);
                      }),
                  }}
                />
              </div>
            </div>
          </span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  partners: makeSelectPartners(),
});

function mapDispatchToProps(dispatch) {
  return {
    onSetPartners: (partners) => dispatch(setPartners(partners)),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default withStyles(useStyles)(compose(withConnect)(PartnerPage));
