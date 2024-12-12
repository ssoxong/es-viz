import React, {useState} from "react";
import {Button, Form, Input, InputNumber, message, Modal} from "antd";
import {createIndex} from "../apis/elasticsearch"; // Elasticsearch API 호출 함수

const NewIndexModal = ({onIndexCreated}) => {
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
            await createIndex(values);
            message.success(`Index ${values.indexName} created successfully!`);
            setIsModalOpen(false);
            form.resetFields();
            onIndexCreated(); // 부모 컴포넌트에 인덱스가 생성되었음을 알림
        } catch (error) {
            message.error("Failed to create index.");
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
                NEW INDEX
            </Button>
            <Modal
                title="Create New Index"
                visible={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                confirmLoading={loading}
                okText="Create"
                cancelText="Cancel"
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        shards: 1, // 기본값 1
                        replicas: 1, // 기본값 1
                    }}
                >
                    <Form.Item
                        label="Index Name"
                        name="indexName"
                        rules={[{required: true, message: "Please enter the index name!"}]}
                    >
                        <Input placeholder="Enter index name"/>
                    </Form.Item>
                    <Form.Item
                        label="Shards"
                        name="shards"
                    >
                        <InputNumber placeholder="Enter number of shards" min={1}/>
                    </Form.Item>
                    <Form.Item
                        label="Replicas"
                        name="replicas"
                    >
                        <InputNumber placeholder="Enter number of replicas" min={0}/>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default NewIndexModal;

