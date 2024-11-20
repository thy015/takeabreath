'use strict';

var _extends = require('babel-runtime/helpers/extends')['default'];

var React = require('react');

var Icon = React.createClass({
  displayName: 'Icon',
  propTypes: {
    glyph: React.PropTypes.string.isRequired,
    classPrefix: React.PropTypes.string,
    children: React.PropTypes.node
  },
  statics: {
    defaultFontPrefix: 'fa',
    setDefaultFontPrefix: function setDefaultFontPrefix(prefix) {
      Icon.defaultFontPrefix = prefix;
    }
  },
  render: function render() {
    var prefix = this.props.classPrefix || Icon.defaultFontPrefix;
    var className = prefix + ' ' + prefix + '-' + this.props.glyph;
    if (this.props.className) {
      className += ' ' + this.props.className;
    }

    return React.createElement(
      'span',
      _extends({}, this.props, { className: className }),
      this.props.children
    );
  }
});

module.exports = Icon;