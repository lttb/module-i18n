import React, { PropTypes } from 'react'
import classnames from 'classnames'

import style from './style.scss'


const LangList = ({ langs, current }, { i18n }) => (
  <div className={style.langSelect}>
    <span>{i18n`Select language (with server side render)`}:</span>
    <ul className={style.langList}>
      {langs.map((lang, index) => (
        <li key={index} className={classnames(style.lang, lang === current && style.current)}>
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
