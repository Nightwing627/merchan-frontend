import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export class Portal extends React.Component {
  componentDidMount() {
    this.element = document.querySelector(this.props.selector);
    this.forceUpdate();
  }

  render() {
    if (this.element === undefined) {
      return null;
    }

    return ReactDOM.createPortal(this.props.children, this.element);
  }
}

Portal.propTypes = {
  selector: PropTypes.any,
  children: PropTypes.any,
};

export default Portal;
