import {Button, DatePicker, Form, Input, Modal, Select, Space} from "antd";
import TextArea from "antd/es/input/TextArea";
import {Categories} from "@/types/categories";
import {useRef, useState} from "react";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

const EditEventModal = (props : {
    open : boolean,
    handleOk : () => void,
    handleCancel : () => void,
    onFinish : (values: any) => void,
    categories : Categories[] | null
}) => {
    const [bannerUrls, setBannerUrls] = useState([""]);
    const submitRef = useRef(null);

    const handleAdd = () => {
        if (bannerUrls.length < 5) {
            setBannerUrls([...bannerUrls, ""]);
        }
    };

    const handleRemove = (index: number) => {
        const newUrls = bannerUrls.filter((_, i) => i !== index);
        setBannerUrls(newUrls);
    };

    const handleChange = (index: number, value: string) => {
        const newUrls = [...bannerUrls];
        newUrls[index] = value;
        setBannerUrls(newUrls);
    };

    const onFinish = (values: any) => {
        const data = {
            name: values.eventName,
            description: values.eventDescription,
            date: values.eventDate,
            image : values.eventImage,
            bannerUrl : bannerUrls,
            location: values.eventLocation,
            createdById : null,
            categorieId: values.eventCategory,
        }
        props.onFinish(data)
    }

    return (
        <Modal
            title="Create Event"
            open={props.open}
            onOk={props.handleOk}
            onCancel={props.handleCancel}
            centered={true}
            footer={[
                <Button key="back" onClick={props.handleCancel}>
                    Annuler
                </Button>,
                // @ts-ignore
                <Button key="submit" type="primary" onClick={() => submitRef.current.click()}>
                    Créer l'événement
                </Button>,
            ]}
        >
            <Form
                name="basic"
                initialValues={{ remember: true }}
                layout={"vertical"}
                onFinish={onFinish}
            >
                <Form.Item
                    label="Nom de l'événement"
                    name="eventName"
                    rules={[{ required: true, message: 'Merci de saisir un nom' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Description de l'événement"
                    name="eventDescription"
                    rules={[{ required: true, message: 'Merci de saisir une description' }]}
                >
                    <TextArea />
                </Form.Item>

                <Form.Item
                    label="Date de l'événement"
                    name="eventDate"
                    rules={[{ required: true, message: 'Merci de saisir la date' }]}
                >
                    <DatePicker />
                </Form.Item>

                <Form.Item
                    label="Lieu de l'événement"
                    name="eventLocation"
                    rules={[{ required: true, message: 'Merci de saisir le lieu!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Image principale de l'événement"
                    name="eventImage"
                    rules={[{ required: true, message: 'Merci de saisir une url d\'image' }]}
                >
                    <Input placeholder="Lien de l'image" />
                </Form.Item>

                <Form.Item label="Bannières de l'événement">
                    {bannerUrls.map((url, index) => (
                        <Space key={index} style={{ display: "flex", marginBottom: 8, width :"100%" }} align="baseline">
                            <Input
                                placeholder="Lien de l'image"
                                value={url}
                                onChange={(e) => handleChange(index, e.target.value)}
                            />
                            {bannerUrls.length > 1 && (
                                <Button
                                    type="dashed"
                                    danger
                                    icon={<MinusCircleOutlined />}
                                    onClick={() => handleRemove(index)}
                                />
                            )}
                        </Space>
                    ))}
                    {bannerUrls.length < 5 && (
                        <Button type="dashed" onClick={handleAdd} icon={<PlusOutlined />}>
                            Ajouter une bannière
                        </Button>
                    )}
                </Form.Item>

                <Form.Item
                    label="Categorie de l'événement"
                    name="eventCategory"
                    rules={[{ required: true, message: 'Merci de choisir une catégorie' }]}
                >
                    <Select options={
                        props.categories ? props.categories.map((category) => {
                            return {label: category.name, value: category.id}
                        }) : []
                    }/>
                </Form.Item>

                <button type={"submit"} ref={submitRef} style={{display : "none"}}/>
            </Form>
        </Modal>
    );
}

export default EditEventModal;