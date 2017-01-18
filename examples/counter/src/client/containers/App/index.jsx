import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { counterIncrement, counterDecrement } from '~/actions'

import Counter from '~/components/Counter'

import style from './style'

const App = ({ counter, ...actions }) => (
  <div className={style.app}>
    <section className={style.content}>
      <header className={style.header}>
        <h1>{i18n`Module i18n example`}</h1>
      </header>

      <main>
        <Counter {...{ counter, actions }} />
      </main>
    </section>
  </div>
)

App.propTypes = {
  counter: PropTypes.number.isRequired,

  counterIncrement: PropTypes.func.isRequired,
  counterDecrement: PropTypes.func.isRequired,
}


export default connect(
  ({ counter }) => ({ counter }),
  { counterIncrement, counterDecrement },
)(App)
