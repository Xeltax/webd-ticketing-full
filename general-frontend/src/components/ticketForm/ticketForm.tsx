import React, {useEffect, useState} from "react";
import { Form, Input, Button, List, Card } from "antd";

const TicketForm = (props : {
    callback : (ticketsValue : { name: string; price: number }[]) => void
    initialTickets? : { name: string; price: number }[]
}) => {
    const [tickets, setTickets] = useState<{ name: string; price: number }[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        setTickets(props.initialTickets || [])
    }, [props.initialTickets])

    const handleAddTicket = () => {
        form.validateFields().then((values) => {
            values.price = Number(values.price);  // Convertir le prix en nombre
            setTickets([...tickets, values]);  // Ajouter le ticket à la liste
            form.resetFields();  // Réinitialiser le formulaire
            setShowForm(false);  // Cacher le formulaire après ajout
            props.callback([...tickets, values])
        });
    };

    const handleRemoveTicket = (index: number) => {
        const newTickets = tickets.filter((_, i) => i !== index);
        setTickets(newTickets);
        props.callback(newTickets)
    };

    return (
        <div>
            <h2>Tickets</h2>

            {showForm ? (
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Nom du ticket"
                        name="name"
                        rules={[{ required: true, message: "Merci de saisir un nom" }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Prix du ticket"
                        name="price"
                        rules={[{ required: true, message: "Merci de saisir un prix" }]}
                    >
                        <Input type="number" />
                    </Form.Item>

                    <Button type="primary" onClick={handleAddTicket}>
                        Ajouter le ticket
                    </Button>
                </Form>
            ) : (
                tickets.length < 5 && (
                    <Button type="primary" variant={"outlined"} onClick={() => setShowForm(true)}>
                        Ajouter un ticket
                    </Button>
                )
            )}

            {tickets.length > 0 && (
                <List
                    dataSource={tickets}
                    grid={{ column: 3 }}
                    renderItem={(ticket, index) => (
                        <Card
                            style={{ marginTop: 10 }}
                            actions={[
                                <Button danger onClick={() => handleRemoveTicket(index)}>
                                    Supprimer
                                </Button>,
                            ]}
                        >
                            <p>
                                <strong>Nom:</strong> {ticket.name}
                            </p>
                            <p>
                                <strong>Prix:</strong> {ticket.price}€
                            </p>
                        </Card>
                    )}
                />
            )}
        </div>
    );
};

export default TicketForm;
