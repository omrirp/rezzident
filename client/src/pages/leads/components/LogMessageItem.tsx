import { LogMessage } from '../../../models/lead';
import { formatDate } from '../../../utils/functions';

interface Props {
  logMessage: LogMessage;
}

const LogMessageItem = ({ logMessage }: Props) => {
  return (
    <div className='logMessageItem'>
      <p className='logDate'>{formatDate(new Date(logMessage.date))}</p>
      <p>{logMessage.message}</p>
    </div>
  );
};

export default LogMessageItem;
