import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ClickOffComponentWrapper extends Component {
  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      if (this.props.nestedModals) {
        return;
      }
      this.props.onOuterClick();
    }
  }

  render() {
    return <div className={this.props.className} ref={this.setWrapperRef}>{this.props.children}</div>;
  }
}

ClickOffComponentWrapper.propTypes = {
  children: PropTypes.any,
  onOuterClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  nestedModals: PropTypes.bool,
};
