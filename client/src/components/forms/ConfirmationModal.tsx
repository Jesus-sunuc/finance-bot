import type { FC } from "react";
import { CustomModal, type ModalButton } from "../ui/CustomModal/CustomModal";
import { useModal } from "../ui/CustomModal/useModal";


export const ConfirmationModal: FC<{
  ModalButton: ModalButton;
  title: string;
  deleteCallback: () => void;
  bodyText?: string;
  bodyHeader?: string;
}> = ({
  ModalButton,
  title,
  deleteCallback,
  bodyText = "This action cannot be undone.",
  bodyHeader = "Are you sure you want to delete this?",
}) => {
  const modalControl = useModal(`delete ${title}`);
  const deleteHandler = async () => {
    deleteCallback();
    modalControl.hide();
  };
  return (
    <CustomModal controls={modalControl} ModalButton={ModalButton}>
      <div className="modal-header">
        <div className="modal-title fs-4">{title}</div>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="modal"
        ></button>
      </div>
      <div className="modal-body">
        <div className="fs-5 text-center">
          <div>{bodyHeader}</div>
          <div>{bodyText}</div>
        </div>
        <div className="row mt-2">
          <div className="col">
            <button
              className="btn btn-secondary w-100"
              type="button"
              onClick={modalControl.hide}
            >
              Close
            </button>
          </div>
          <div className="col">
            <button
              className="btn btn-danger w-100"
              type="button"
              onClick={deleteHandler}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};
