import React, {useEffect} from "react";
import {Form, Input, message, Modal} from "antd";
import {updateIndexData} from "../apis/elasticsearch"; // Elasticsearch 업데이트 API

const UpdateModal = ({
                         visible,
                         editingRow,
                         setEditingRow,
                         setEditModalVisible,
                         data,
                         setData,
                     }) => {
    const [form] = Form.useForm();

    // 모달이 열릴 때 폼 초기화
    useEffect(() => {
        if (editingRow) {
            form.setFieldsValue(editingRow);
        }
    }, [editingRow, form]);

    const handleUpdateRow = async () => {
        try {
            const updatedData = await form.validateFields();
            const updatedRow = {...editingRow, ...updatedData};
            const index = updatedRow.index;
            const id = updatedRow.id;

            // Elasticsearch 데이터 업데이트
            await updateIndexData(index, id, updatedData);

            // 클라이언트 데이터 업데이트
            const updatedTableData = data.map((row) =>
                row.id === id ? {...row, ...updatedData} : row
            );
            setData(updatedTableData);

            message.success("Document updated successfully.");
            setEditModalVisible(false);
            setEditingRow(null);
        } catch (error) {
            message.error("Failed to update document.");
        }
    };

    const handleCancelEdit = () => {
        form.resetFields(); // 폼 필드 초기화
        setEditModalVisible(false);
        setEditingRow(null);
    };

    return (
        <Modal
            title="Edit Document"
            visible={visible}
            onOk={handleUpdateRow}
            onCancel={handleCancelEdit}
        >
            <Form form={form} layout="vertical">
                {Object.keys(editingRow || {})
                    .filter((key) => key !== "id" && key !== "index" && key !== "score") // "id", "index", "score" 필드는 수정 불가
                    .map((key) => (
                        <Form.Item
                            key={key}
                            name={key}
                            label={key.replace(/_/g, " ").toUpperCase()}
                        >
                            <Input/>
                        </Form.Item>
                    ))}
            </Form>
        </Modal>
    );
};

export default UpdateModal;
