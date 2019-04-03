import React,{Component} from 'react'
import './style.css'
import { Modal,Button} from 'semantic-ui-react';
class InstructionDeletedModal extends Component
{
    render()
    {
        return(
            <Modal open={this.props.showModal} onClose={this.props.closeModal} basic size='tiny' style={{ width: '100%' }}>
            <div className="instAddModalContainer">
              <div className="instAddModal" style={{ backgroundImage: 'url(images/Added1.png)', backgroundSize: 'cover' }}>
                <div className='headStyle'>
                  <h1 style={{ color: 'white' }}>Instruction deleted!</h1>
                </div>
                <Button color='green' className='btn2' onClick={this.props.closeModal}>OK</Button>
              </div>
            </div>
          </Modal>
        )
    }
}
export default InstructionDeletedModal;