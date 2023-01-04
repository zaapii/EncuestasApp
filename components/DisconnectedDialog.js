import { AlertDialog, Button } from "native-base";

const DisconnectedDialog = ({ isOpen, onClose }) => {
  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
    >
      <AlertDialog.Content>
        <AlertDialog.CloseButton />
        <AlertDialog.Header>You have no internet connection</AlertDialog.Header>
        <AlertDialog.Body>
          There is only one account in the database to enter:
          email: admin@admin.com
          password: password
        </AlertDialog.Body>
        <AlertDialog.Footer>
          <Button colorScheme="danger" onPress={onClose}>
            Ok
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
};

export default DisconnectedDialog;
