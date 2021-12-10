import { Alert, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from "solid-bootstrap";
import { createSignal } from "solid-js";

function App() {
	const [showModal, setShowModal] = createSignal(false);

	return (
		<>
			<div className="row my-2">
				<div className="d-flex justify-content-center">
					<h1>Hello, World!</h1>
				</div>
			</div>
			<Alert dismissible="true">This is a simple alert.</Alert>
			<Modal show={showModal()}>
				<ModalHeader onHide={() => setShowModal(value => !value)}>
					<ModalTitle>This is the modal title</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<p>This is the modal body.</p>
				</ModalBody>
				<ModalFooter>
					<p>This is the modal footer.</p>
				</ModalFooter>
			</Modal>
		</>
	);
}

export default App;