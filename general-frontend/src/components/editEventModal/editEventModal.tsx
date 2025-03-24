import { Button, DatePicker, Divider, Form, Input, Modal, Select, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import { Categories } from "@/types/categories";
import { useEffect, useRef, useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import TicketForm from "@/components/ticketForm/ticketForm";
import dayjs from "dayjs";

const EditEventModal = (props: {
    open: boolean;
    handleOk: () => void;
    handleCancel: () => void;
    onFinish: (values: any) => void;
    categories: Categories[] | null;
    eventData: any; // Les données de l'événement à éditer
}) => {
    const submitRef = useRef(null);
    const [bannerUrls, setBannerUrls] = useState<string[]>([]);
    const [tickets, setTickets] = useState<{ name: string; price: number }[]>([]);

    useEffect(() => {
        if (props.eventData) {
            setBannerUrls(props.eventData.bannerUrl || [""]);
            setTickets(props.eventData.tickets || []);
        }
    }, [props.eventData]);

    const handleAddBanner = () => {
        if (bannerUrls.length < 5) {
            setBannerUrls([...bannerUrls, ""]);
        }
    };

    const handleRemoveBanner = (index: number) => {
        setBannerUrls(bannerUrls.filter((_, i) => i !== index));
    };

    const handleChangeBanner = (index: number, value: string) => {
        const newUrls = [...bannerUrls];
        newUrls[index] = value;
        setBannerUrls(newUrls);
    };

    const onFinish = (values: any) => {
        const data = {
            ...props.eventData, // Garde les autres données de l'event
            name: values.eventName,
            description: values.eventDescription,
            date: values.eventDate,
            image: values.eventImage,
            bannerUrl: bannerUrls,
            location: values.eventLocation,
            categorieId: values.eventCategory,
            tickets: tickets,
        };

        props.onFinish(data);
    };

    return (
        <Modal
            open={props.open}
            onOk={props.handleOk}
            onCancel={props.handleCancel}
            centered
            footer={[
                <Button key="back" onClick={props.handleCancel}>
                    Annuler
                </Button>,
                // @ts-ignore
                <Button key="submit" type="primary" onClick={() => submitRef.current?.click()}>
                    Modifier l'événement
                </Button>,
            ]}
        >
            <h2>Modifier l'événement</h2>
            {props.eventData && (
                <Form
                    name="edit-event"
                    initialValues={{
                        eventName: props.eventData.name,
                        eventDescription: props.eventData.description,
                        eventDate: dayjs(props.eventData.date), // Conversion pour DatePicker
                        eventLocation: props.eventData.location,
                        eventImage: props.eventData.image,
                        eventCategory: props.eventData.categorieId,
                    }}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Nom de l'événement"
                        name="eventName"
                        rules={[{ required: true, message: "Merci de saisir un nom" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Description de l'événement"
                        name="eventDescription"
                        rules={[{ required: true, message: "Merci de saisir une description" }]}
                    >
                        <TextArea />
                    </Form.Item>

                    <Form.Item
                        label="Date de l'événement"
                        name="eventDate"
                        rules={[{ required: true, message: "Merci de saisir la date" }]}
                    >
                        <DatePicker placeholder="Saisir la date" />
                    </Form.Item>

                    <Form.Item
                        label="Lieu de l'événement"
                        name="eventLocation"
                        rules={[{ required: true, message: "Merci de saisir le lieu!" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Image principale de l'événement"
                        name="eventImage"
                        rules={[{ required: true, message: "Merci de saisir une URL d'image" }]}
                    >
                        <Input placeholder="Lien de l'image" />
                    </Form.Item>

                    <Form.Item label="Bannières de l'événement">
                        {bannerUrls.map((url, index) => (
                            <Space key={index} style={{ display: "flex", marginBottom: 8, width: "100%" }} align="baseline">
                                <Input placeholder="Lien de l'image" value={url} onChange={(e) => handleChangeBanner(index, e.target.value)} />
                                {bannerUrls.length > 1 && (
                                    <Button type="dashed" danger icon={<MinusCircleOutlined />} onClick={() => handleRemoveBanner(index)} />
                                )}
                            </Space>
                        ))}
                        {bannerUrls.length < 5 && (
                            <Button type="dashed" onClick={handleAddBanner} icon={<PlusOutlined />}>
                                Ajouter une bannière
                            </Button>
                        )}
                    </Form.Item>

                    <Form.Item
                        label="Catégorie de l'événement"
                        name="eventCategory"
                        rules={[{ required: true, message: "Merci de choisir une catégorie" }]}
                    >
                        <Select
                            options={props.categories ? props.categories.map((category) => ({ label: category.name, value: category.id })) : []}
                        />
                    </Form.Item>

                    <button type="submit" ref={submitRef} style={{ display: "none" }} />
                </Form>
            )}
            <Divider />
            <TicketForm initialTickets={tickets} callback={(ticketsValue) => setTickets(ticketsValue)} />
        </Modal>
    );
};

export default EditEventModal;
