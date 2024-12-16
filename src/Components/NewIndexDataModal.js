import React, {useState} from "react";
import {Button, Form, Input, message, Modal} from "antd";
import {createIndexData} from "../apis/elasticsearch"; // Elasticsearch API 호출 함수

const NewIndexDataModal = ({indexName, onDocumentCreated}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);

            // Elasticsearch API 호출
            await createIndexData(indexName, values);
            message.success(`Document added to index ${indexName} successfully!`);
            setIsModalOpen(false);
            form.resetFields();
            onDocumentCreated(); // 부모 컴포넌트에 문서가 생성되었음을 알림
        } catch (error) {
            message.error("Failed to add document.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    return (
        <div>
            <Button type="primary" onClick={showModal}>
                ADD DOCUMENT
            </Button>
            <Modal
                title={`Add Document to Index: ${indexName}`}
                visible={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={loading}
                okText="Add"
                cancelText="Cancel"
            >
                <Form
                    form={form}
                    layout="vertical"
                >
                    <Form.Item
                        label="Document ID (Optional)"
                        name="id"
                        rules={[
                            {
                                pattern: /^[a-zA-Z0-9_-]*$/,
                                message: "ID can only contain letters, numbers, hyphens, or underscores!"
                            },
                        ]}
                    >
                        <Input placeholder="Enter document ID (optional)"/>
                    </Form.Item>
                    <Form.Item
                        label="Document Body (JSON)"
                        name="body"
                        rules={[
                            {required: true, message: "Please enter the document body!"},
                            {
                                validator: (_, value) =>
                                    new Promise((resolve, reject) => {
                                        try {
                                            JSON.parse(value); // Validate JSON format
                                            resolve();
                                        } catch {
                                            reject("Invalid JSON format!");
                                        }
                                    }),
                            },
                        ]}
                    >
                        <Input.TextArea
                            placeholder='Enter document body in JSON format, e.g., {"key": "value"}'
                            autoSize={{minRows: 4, maxRows: 8}}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default NewIndexDataModal;
