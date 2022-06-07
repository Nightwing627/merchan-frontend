/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import objectPath from "object-path";
import { LayoutContextConsumer } from "../LayoutContext";

import * as builder from "../../ducks/builder";
// import BreadCrumbs from "./components/BreadCrumbs";

class SubHeader extends React.Component {
  render() {
    const { subheaderClasses, subheaderContainerClasses } = this.props;
    return (
      <>
        <div
          className={`kt-subheader kt-grid__item ${subheaderClasses}`}
          id="kt_subheader"
        >
          <div className={`kt-container ${subheaderContainerClasses}`}>
            {/*Subheader Main*/}
            <div className="kt-subheader__main">
              <LayoutContextConsumer>
                {/*{({ subheader: { title, breadcrumb } }) => (*/}
                {({ subheader: { title } }) => (
                  <>
                    <h3
                      className="kt-subheader__title"
                    >
                      {title}
                    </h3>
                    {/*<BreadCrumbs items={breadcrumb} />*/}
                  </>
                )}
              </LayoutContextConsumer>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (store) => ({
  config: store.builder.layoutConfig,
  menuConfig: store.builder.menuConfig,
  menuHeaderDisplay: objectPath.get(
    store.builder.layoutConfig,
    "header.menu.self.display"
  ),
  layout: objectPath.get(store.builder.layoutConfig, "subheader.layout"),
  fluid:
    objectPath.get(store.builder.layoutConfig, "footer.self.width") === "fluid",
  clear: objectPath.get(store.builder.layoutConfig, "subheader.clear"),
  isOpen: false,
  subheaderClasses: builder.selectors.getClasses(store, {
    path: "subheader",
    toString: true,
  }),
  subheaderContainerClasses: builder.selectors.getClasses(store, {
    path: "subheader_container",
    toString: true,
  }),
});

export default withRouter(connect(mapStateToProps)(SubHeader));
