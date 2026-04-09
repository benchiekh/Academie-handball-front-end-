import React from 'react';
interface AddPlayerFormProps {
    onPlayerAdded: () => void;
    onCancel: () => void;
}
declare const AddPlayerForm: React.FC<AddPlayerFormProps>;
export default AddPlayerForm;
