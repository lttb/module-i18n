import { Component, PropTypes, Children } from 'react'


export default class I18nProvider extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    i18n: PropTypes.func.isRequired,
  }

  static childContextTypes = {
    i18n: PropTypes.func.isRequired,
  }

  getChildContext = () => ({ i18n: this.i18n })

  i18n = this.props.i18n

  render = () => Children.only(this.props.children)
}
