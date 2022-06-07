/* eslint-disable no-restricted-imports */
import React from "react";
import { makeStyles } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { Paper, Button } from "@material-ui/core";
import OpenInNewRoundedIcon from "@material-ui/icons/OpenInNewRounded";
import dynamic from "react-dynamic";
import './_contract.css'
import downloadHelper from "../../../../utils";

const CKEditor = dynamic(() => import("../../common/CKEditor"), {
  ssr: false,
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
  button: {
    margin: theme.spacing(1),
  },
}));
class ContractPage extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      userParagraphs: "<b>Cláusula 3ª.</b> O LOCATÁRIO deverá escolher, dentro das exigências feitas pelo município, onde será instalado o outdoor, especificando as características de propaganda e arte do mesmo, bem como a logomarca e cores a ser utilizada na publicidade. Essa escolha deverá ser feita com uma antecedência de (xxx) dias, para que o LOCADOR aprove ou não.",
      valid: true,
    };
  }

  handleCkEditorChange = (name, value) => this.setState({ [name]: value });

  handleDownload () {
    const pdfElement = document.getElementsByClassName('pdf')[0]
    const editor = pdfElement.getElementsByClassName('sc-AxjAm')[0]
    const btnDownload = pdfElement.getElementsByClassName('btn-download')[0]
    const textEditor = pdfElement.getElementsByClassName('text-editor')[0]
    editor.setAttribute('hidden', true)
    btnDownload.setAttribute('hidden', true)
    textEditor.removeAttribute('hidden')
    downloadHelper.convertHTMLToPDF(pdfElement, 300).then((pdf) => {
      editor.removeAttribute('hidden')
      btnDownload.removeAttribute('hidden')
      textEditor.setAttribute('hidden', true)
      pdf.save()
    });
  }

  render () {
    const { classes } = this.props;
    const { userParagraphs, valid } = this.state;
    return (
      <div className="row" style={{ marginTop: 20 }}>
        <div className="col-md-9">
          <Paper square>
            <div className="kt-section pdf" style={{ padding: "20px 10px" }}>
              <div
                className="kt-section__sub"
                style={{ textAlign: "center", margin: '30px 60px' }}
              >
                <p className="text-header">
                  ADVERTISING SPACE LEASE AGREEMENT WITH A SPECIFIC TERM
                  IDENTIFYING THE CONTRACTING PARTIES
                </p>
                <div className="text-infor">
                  <b>LOCADOR: TACLA SHOPPING LTDA</b>, com sede na Av. Presidente Kennedy, 4121, Portão,  Curitiba, Paraná – CEP 80.610-905, inscrita no C.N.P.J. sob o n.º 22.951.189/0001-30, com I.E n.º 1145746, devidamente representada neste ato por <b>CARLOS JORGE FÁRIA</b>, Advogado, Brasileiro, Casado Carteira de Identidade nº 99695741-1 e C.P.F. nº 074.399.554+58, residente e domiciliado na Rua Antonio Bartapeli, 160 - Santa Felicidade, Curitiba - PR, 82030-460;
                </div>
                <div className="text-infor">
                  <b>LOCATÁRIO: TACLA SHOPPING LTDA</b>, com sede na Av. Presidente Kennedy, 4121, Portão,  Curitiba, Paraná – CEP 80.610-905, inscrita no C.N.P.J. sob o n.º 22.951.189/0001-30, com I.E n.º 1145746, devidamente representada neste ato por CARLOS JORGE FÁRIA, Advogado, Brasileiro, Casado Carteira de Identidade nº 99695741-1 e C.P.F. nº 074.399.554+58, residente e domiciliado na Rua Antonio Bartapeli, 160 - Santa Felicidade, Curitiba - PR, 82030-460;
                </div>
                <div style={{ textAlign: 'left' }}>
                  <b >
                    As partes acima identificadas têm, entre si, justo e acertado o presente Contrato de Locação de Espaço Publicitário de Prazo Determinado, ficando desde já aceito, pelas cláusulas abaixo descritas.
                  </b>
                </div>
                <p className="text-header">
                  DO OBJETO DO CONTRATO
                </p>
                <div className="text-infor">
                  <b>Cláusula 1ª.</b> O presente contrato tem como OBJETO a locação de espaço (outdoor) a ser utilizado para fins publicitários.
                </div>
                <div className="text-infor">
                  <b>Cláusula 2ª.</b> O referido outdoor terá as medidas de (xxx)cm por (xxx)cm, e estará situado à Rua (xxx), em frente ao nº (xxx), na cidade de (xxx), no Estado (xxx).
                </div>
                <p className="text-header">
                  DOS DIREITOS E DAS OBRIGAÇÕES DO LOCATÁRIO
                </p>
                <div className="text-infor">
                  <b>Cláusula 3ª.</b> O LOCATÁRIO deverá escolher, dentro das exigências feitas pelo município, onde será instalado o outdoor, especificando as características de propaganda e arte do mesmo, bem como a logomarca e cores a ser utilizada na publicidade. Essa escolha deverá ser feita com uma antecedência de (xxx) dias, para que o LOCADOR aprove ou não.
                </div>
                <div className="text-editor" hidden dangerouslySetInnerHTML={{ __html: userParagraphs ? userParagraphs : "" }}>
                </div>
                <CKEditor
                  data={userParagraphs ? userParagraphs : ""}
                  name="userParagraphs"
                  valid={valid || (!valid && userParagraphs !== "")}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    this.handleCkEditorChange("userParagraphs", data);
                  }}

                />
              </div>
              <div className="kt-section__content btn-download" style={{ margin: '30px 60px' }}>
                <div className={classes.root}>
                  <Button
                    variant="outlined"
                    className={classes.button}
                    fullWidth
                    style={{ padding: 10 }}
                    onClick={this.handleDownload.bind(this)}
                  >
                    DownLoad
                  </Button>
                </div>
              </div>
            </div>
          </Paper>
        </div>
        <div className="col-md-3">
          <div className="kt-section">
            <div className="kt-section__sub">
              drag the item below to the document to create a new section.
            </div>
            <div className="kt-section__content">
              <Paper>
                <div style={{ padding: "10px", marginTop: 20 }}>
                  <OpenInNewRoundedIcon />
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: "bold",
                      marginLeft: "20px",
                    }}
                  >
                    New Text Section
                  </span>
                </div>
              </Paper>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(useStyles)(ContractPage);
