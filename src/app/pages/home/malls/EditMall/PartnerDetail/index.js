import React from "react";
// eslint-disable-next-line no-restricted-imports
import { withStyles } from "@material-ui/core/styles";
import { Button, Divider, TextField } from "@material-ui/core";
import MaterialTable, { MTableEditRow } from "material-table";
import InputMask from "react-input-mask";
import { Formik, Field, getIn } from "formik";

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
  constructor (props) {
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

  handleCompanyNumberChange (event, setFieldValue, errors) {
    const value = event.target ? event.target.value : event
    if (value) {
      const { partners } = this.props
      const existedPartners = partners && partners.find((p) => p.companyNumber === value)
      if (existedPartners) {
        setFieldValue('companyName', existedPartners.companyName);
      } else if(Object.keys(errors).length === 0) {
        setFieldValue('companyName', '');
      }
    }
  };

  render () {
    const { columns } = this.state;
    const {
      partnerPageState,
      handleChangePartner,
      handleUpdateMall,
    } = this.props;
    const { partners = [] } = partnerPageState;
    const FormikMTInput = (props) => {
      return (
        <Field name={props.columnDef.field}>
          {({ field, form }) => {
            const { name } = field;
            const { errors, setFieldValue, submitForm, values } = form;
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
                    onBlur={(e) => this.handleCompanyNumberChange(e, setFieldValue, errors)}
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
                    onKeyPress={(event) => {
                      if (event.key === "Enter") {
                        const result = this.getMatchedCompanyNameByCompanyNumber(
                          values.companyNumber
                        );
                        if (result) {
                          setFieldValue(name, result);
                          submitForm(values);
                        }
                      }
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
            console.log('values:', values)
            if (values) {
              if (values.companyNumber) {
                if (props.mode === "update" && (props.data.companyName !== values.companyName
                  || props.data.companyNumber !== values.companyNumber)) delete values.tableData;
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
      <div className="col-md-12" style={{ marginTop: 20 }}>
        <div className="kt-section">
          <span className="kt-section__sub">
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
                  name="partners"
                  components={{
                    EditRow: MuiTableEditRow,
                    EditField: FormikMTInput,
                  }}
                  editComponent={<TextField variant="outlined" />}
                  editable={{
                    onRowAdd: (newData) =>
                      new Promise((resolve) => {
                        setTimeout(() => {
                          resolve();
                          handleChangePartner("Add", newData);
                        }, 600);
                      }),
                    onRowUpdate: (newData, oldData) =>
                      new Promise((resolve) => {
                        setTimeout(() => {
                          resolve();
                          if (oldData) {
                            handleChangePartner("Update", newData, oldData);
                          }
                        }, 600);
                      }),

                    onRowDelete: (oldData) =>
                      new Promise((resolve) => {
                        setTimeout(() => {
                          resolve();
                          handleChangePartner("Delete", null, oldData);
                        }, 600);
                      }),
                  }}
                />
              </div>
            </div>
            <Divider />
            <div
              className="row"
              style={{ padding: 20, float: "right", marginRight: 20 }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateMall}
              >
                Save
              </Button>
            </div>
            <div style={{ clear: "both" }}></div>
          </span>
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(PartnerPage);
