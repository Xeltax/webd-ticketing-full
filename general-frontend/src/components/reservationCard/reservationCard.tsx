import {Reservation} from "@/types/reservation";
import {Event} from "@/types/event";
import {Ticket} from "@/types/ticket";
import {useState} from "react";
import {Button, Card, Col, Modal, Row, Tag, Image, Typography} from "antd";
import {CalendarOutlined, ContainerOutlined, EnvironmentOutlined} from "@ant-design/icons";
import Title from "antd/es/typography/Title";

interface ReservationCardProps {
    createdAt: Date;
    event: Event;
    ticket: Ticket;
}

const ReservationCard: React.FC<ReservationCardProps> = ({ createdAt, event, ticket }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <Card
                hoverable
                onClick={showModal}
                style={{ marginBottom: 16 }}
                cover={
                    <Image
                        alt={event.name}
                        src={event.image || event.bannerUrl[0]}
                        preview={false}
                        height={200}
                        style={{ objectFit: 'cover' }}
                    />
                }
            >
                <Card.Meta
                    title={event.name}
                    description={
                        <div>
                            <div>
                                <CalendarOutlined /> {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div>
                                <EnvironmentOutlined /> {event.location}
                            </div>
                            <div>
                                <ContainerOutlined /> {ticket.name} - {ticket.price.toLocaleString()}€
                            </div>
                            <Tag color="blue" style={{ marginTop: 8 }}>
                                Réservé le {new Date(createdAt).toLocaleDateString()}
                            </Tag>
                        </div>
                    }
                />
            </Card>

            <Modal
                title={event.name}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Fermer
                    </Button>
                ]}
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Image
                            preview={false}
                            src={event.image || event.bannerUrl[0]}
                            alt={event.name}
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </Col>
                    <Col span={12}>
                        <Title level={4}>Détails de l'événement</Title>
                        <Typography style={{fontWeight : "bold"}}>Description:</Typography>
                        <p>{event.description}</p>
                        <Typography style={{fontWeight : "bold"}}>Date:</Typography>
                        <p>{new Date(event.date).toLocaleString()}</p>
                        <Typography style={{fontWeight : "bold"}}>Lieu:</Typography>
                        <p>{event.location}</p>
                        <Typography style={{fontWeight : "bold"}}>Ticket:</Typography>
                        <p>{ticket.name} - {ticket.price.toLocaleString()}€</p>
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default ReservationCard;