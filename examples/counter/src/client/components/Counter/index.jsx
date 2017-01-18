import React, { PropTypes } from 'react'


const Counter = ({ counter, actions: { counterIncrement, counterDecrement } }) => (
  <div>
    <p>
      {i18n`Clicked ${counter} ${i18n(counter, 'time || times')}`}
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


export default Counter
