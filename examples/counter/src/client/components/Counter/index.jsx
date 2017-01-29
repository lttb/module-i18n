import React, { PropTypes } from 'react'


const Counter = ({ counter, actions: { counterIncrement, counterDecrement } }, { i18n }) => (
  <div>
    <p>
      {i18n`Today is ${() => i18n.formatDate(new Date())}`}
    </p>
    <p>
      {i18n`fallback: ${{ counter }} % 2 ${`${counter % 2}, "fallback || fallbacks"`}`}
    </p>
    <p>
      {i18n`Counter clicked ${{ counter }} ${'counter, "time || times"'}`}
    </p>

    <button onClick={counterIncrement}>{i18n`Increment`}</button>
    <button onClick={counterDecrement}>{i18n`Decrement`}</button>
  </div>
)

Counter.propTypes = {
  counter: PropTypes.number.isRequired,

  actions: PropTypes.shape({
    counterIncrement: PropTypes.func.isRequired,
    counterDecrement: PropTypes.func.isRequired,
  }),
}

Counter.contextTypes = {
  i18n: PropTypes.func,
}


export default Counter
