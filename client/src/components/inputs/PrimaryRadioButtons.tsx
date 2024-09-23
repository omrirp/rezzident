import React from 'react';

interface Props {
  options: string[];
  selectedOption: string;
  setOption: React.Dispatch<React.SetStateAction<string>>;
  placeHolder: string;
}

/**
 * Custom design radio button group.
 * This component takes an array of string 'options' and each string
 * will serve as a radio button ion the group.
 * The component takes advantage of the React useState hook and must
 * receive the state and setState function for option and setOption accord.
 * Example:
 * const [state, setState] = useState<string>('');
 * <PrimaryRadioButtons option={state} setOption={setState} />
 */
const PrimaryRadioButtons = ({ options, selectedOption, setOption, placeHolder }: Props) => {
  const selectHandler = (option: string) => {
    setOption(option);
  };

  return (
    <div>
      <label className='formLbl'>{placeHolder}:</label>
      <div className='primaryRadioButtonsContainer'>
        {options.map((option) => (
          <button
            key={option}
            value={option}
            type='button'
            className='btn btn-success radioBtn'
            style={{
              backgroundColor: option == selectedOption ? '#00897b' : '#ec6378',
            }}
            onClick={() => selectHandler(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PrimaryRadioButtons;
