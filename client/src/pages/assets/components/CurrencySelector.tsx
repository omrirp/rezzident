interface Props {
  currency: string;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * Simple select component for currency.
 */
const CurrencySelector = ({ currency, setCurrency }: Props) => {
  return (
    <>
      <label htmlFor='currency' className='formLbl'>
        Currency:
      </label>
      <select value={currency} onChange={(e) => setCurrency(e.target.value)} name='Currency' id='currency' className='form-control'>
        <option value='NIS'>NIS</option>
        <option value='USD'>USD</option>
        <option value='EUR'>EUR</option>
      </select>
    </>
  );
};

export default CurrencySelector;
