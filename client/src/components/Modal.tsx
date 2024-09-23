interface Props {
  header: string;
  body: string;
  onYesCLick: () => any;
  id: string;
}

/**
 * To show this Modal component with a button press "data-bs-toggle='modal' data-bs-target='#${id}'"
 * must be added to the button properties
 */
const Modal = ({ header, body, onYesCLick, id }: Props) => {
  return (
    <div
      className='modal fade'
      id={id}
      data-bs-backdrop='static'
      data-bs-keyboard='false'
      tabIndex={-1}
      aria-labelledby='staticBackdropLabel'
      aria-hidden='true'
    >
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h1 className='modal-title fs-5' id='staticBackdropLabel'>
              {header}
            </h1>
            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close'></button>
          </div>
          <div className='modal-body'>{body}</div>
          <div className='modal-footer'>
            <button type='button' className='btn btn-secondary' data-bs-dismiss='modal'>
              No
            </button>
            <button onClick={onYesCLick} type='button' className='btn btn-primary' data-bs-dismiss='modal'>
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
