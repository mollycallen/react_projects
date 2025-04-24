import { OperatorButton, NumberButton } from './Button'

const ButtonPanel = ({
  onNumberClick,
  onOperatorClick,
  onSignClick,
  onEqualClick,
  onClearClick,
  onBackspaceClick,
  onRandomClick
}) => {
  return (
    <div>
      <div className='row row-cols-4 g-2'>
        <div className='col'>
          <div className='col'>
            <NumberButton
              label={'Random'}
              onClick={onRandomClick}
              className='px-1 fw-normal'
            />
          </div>
        </div>
        <div className='col'>
          <OperatorButton label={'C'} onClick={onClearClick} />
        </div>
        <div className='col'>
          <OperatorButton label={'⌫'} onClick={onBackspaceClick} />
        </div>
        <div className='col'>
          <OperatorButton label={'÷'} onClick={() => onOperatorClick('/')} />
        </div>
        <div className='col'>
          <NumberButton label={'7'} onClick={() => onNumberClick('7')} />
        </div>
        <div className='col'>
          <NumberButton label={'8'} onClick={() => onNumberClick('8')} />
        </div>
        <div className='col'>
          <NumberButton label={'9'} onClick={() => onNumberClick('9')} />
        </div>
        <div className='col'>
          <OperatorButton label={'×'} onClick={() => onOperatorClick('*')} />
        </div>
        <div className='col'>
          <NumberButton label={'4'} onClick={() => onNumberClick('4')} />
        </div>
        <div className='col'>
          <NumberButton label={'5'} onClick={() => onNumberClick('5')} />
        </div>
        <div className='col'>
          <NumberButton label={'6'} onClick={() => onNumberClick('6')} />
        </div>
        <div className='col'>
          <OperatorButton label={'-'} onClick={() => onOperatorClick('-')} />
        </div>
        <div className='col'>
          <NumberButton label={'1'} onClick={() => onNumberClick('1')} />
        </div>
        <div className='col'>
          <NumberButton label={'2'} onClick={() => onNumberClick('2')} />
        </div>
        <div className='col'>
          <NumberButton label={'3'} onClick={() => onNumberClick('3')} />
        </div>
        <div className='col'>
          <OperatorButton label={'+'} onClick={() => onOperatorClick('+')} />
        </div>

        <div className='col'>
          <OperatorButton label={'+/-'} onClick={onSignClick} />
        </div>
        <div className='col'>
          <NumberButton label={'0'} onClick={() => onNumberClick('0')} />
        </div>
        <div className='col'>
          <NumberButton label={'.'} onClick={() => onNumberClick('.')} />
        </div>

        <div className='col'>
          <OperatorButton label={'='} onClick={() => onEqualClick('=')} />
        </div>
      </div>
    </div>
  )
}

export default ButtonPanel
