import { Button, Dialog } from "@radix-ui/themes";
import MultiStepForm from "./MultiStepForm";

function FormDialog({ lat, long }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>Upload</Button>
      </Dialog.Trigger>
      <Dialog.Content width={"100vw"}>
        <MultiStepForm lat={lat} long={long} />
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default FormDialog;
