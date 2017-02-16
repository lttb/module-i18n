import React, { PropTypes } from 'react'
import classnames from 'classnames'

import './style.scss'


const LangList = ({ langs, current }, { i18n }) => (
  <div>
    <span>{i18n`Select language (with server side render)`}:</span>
    <ul styleName="langList">
      {langs.map((lang, index) => (
        <li key={index} styleName={classnames('lang', lang === current && 'current')}>
          <a href={lang}>{lang}</a>
        </li>
      ))}
    </ul>
  </div>
)

LangList.propTypes = {
  langs: PropTypes.arrayOf(PropTypes.string).isRequired,
  current: PropTypes.string.isRequired,
}

LangList.contextTypes = {
  i18n: PropTypes.func,
}


export default LangList
