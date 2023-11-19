import {Button, Modal} from "reactstrap";

const DeleteModal = ({ open, handleModal, handleDelete, productId }) => {

  const handleSubmit = () => {
    handleDelete(productId);
    handleModal();
  }

  return (

      <Modal open={open} onClose={handleModal}>
        <div>
          <h3>Are you sure you want to delete this product?</h3>
          <Button onClick={handleSubmit}>Delete</Button>
          <Button onClick={handleModal}>Cancel</Button>
        </div>
      </Modal>
  );
}
export default DeleteModal;