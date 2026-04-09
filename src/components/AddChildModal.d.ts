import React from 'react';
interface AddChildModalProps {
    isOpen: boolean;
    onClose: () => void;
    onChildAdded: () => void;
    parentId: number;
    parentName: string;
}
declare const AddChildModal: React.FC<AddChildModalProps>;
export default AddChildModal;
