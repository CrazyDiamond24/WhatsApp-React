export function ReusableModal({ isOpen, onClose, children }) {
  return (
    isOpen && (
      <div className='modal-overlay'>
        <div className='modal-container'>
          <button className='close-btn-modal' onClick={onClose}>X</button>
          {children}
        </div>
      </div>
    )
  )
}
