import React, { useState, useContext } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { ThemeContext } from '../App'

const ModalComponent = ({ title, BodyComponent }) => {
  const { darkMode, textColor, bgColor } = useContext(ThemeContext)
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <>
      <Button variant='primary' onClick={handleShow}>
        {title}
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        animation={true}
        backdrop='static'
        keyboard={false}
        transition={{ timeout: 1000 }}
        contentClassName={`${bgColor} bg-gradient ${textColor} w-100`}
        dialogClassName='modal-fit-content '
      >
        <Modal.Header
          closeButton
          {...(darkMode ? { closeVariant: 'white' } : {})}
        >
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BodyComponent />
        </Modal.Body>
      </Modal>
    </>
  )
}

export default ModalComponent
