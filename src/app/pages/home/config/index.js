import React from "react";
import PropTypes from "prop-types";
import { Tab, Tabs, Paper,Typography } from "@material-ui/core";
import GeneralPage from './general';
import ContractPage from './contract';
function TabContainer1(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer1.propTypes = {
  children: PropTypes.node.isRequired
};

export default function ConfigPage() {
  const [activeTab, setActiveTab] = React.useState(0);

  function handleActiveTab(event,activeTab) {
    console.log('newValue:',activeTab)
    setActiveTab(activeTab);
  }
  return (
    <div className="kt-section__content">
      <Paper square>
        <Tabs
          value={activeTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleActiveTab}
        >
          <Tab label="General" />
          <Tab label="Contract" />
        </Tabs>
      </Paper>
      {activeTab === 0 && <GeneralPage/>}
      {activeTab === 1 && <ContractPage/>}
    </div>
  );
}
