import MainLayout from "@/components/layout/MainLayout";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {Event} from "@/types/event";
import {parse} from "cookie";
import Client, {setBearerToken} from "@/utils/client";
import {ROUTES} from "@/utils/routes";
import HandleError from "@/components/handleError/handleError";
import styles from "@/styles/EventDetail.module.css"
import React, {useEffect, useState} from 'react';
import {
    Breadcrumb,
    Row,
    Col,
    Typography,
    Tag,
    Carousel,
    Descriptions,
    Card,
    Button,
    Avatar,
    List,
    Divider,
    Tabs,
    Modal,
    Form,
    Input,
    message
} from 'antd';
import {
    CalendarOutlined,
    PushpinOutlined,
    HeartOutlined,
    UserOutlined,
    ShareAltOutlined,
    BookOutlined, ContainerOutlined
} from '@ant-design/icons';
import {Ticket} from "@/types/ticket";
import {useRouter} from "next/router";
import {getCookie} from "cookies-next";
import TicketBookingModal from "@/components/ticketModal/ticketModal";
import {User} from "@/types/user";
const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const EventDetailPage = ({event, user}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [ticketType, setTicketType] = useState<Ticket>();
    const [selectedTicket, setSelectedTicket] = useState<Ticket>();
    const [isLogged, setIsLogged] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();

    const showModal = (ticket : any) => {
        setTicketType(ticket);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleBooking = () => {
        messageApi.success('Votre réservation a été prise en compte !');
        setIsModalVisible(false);
    };

    useEffect(() => {
        const token = getCookie("JWT")

        if (token) {
            setIsLogged(true)
        } else {
            setIsLogged(false)
        }
    }, [])

    return (
        event === null ?
            <HandleError/>
            :
            <div className={styles.container}>
                {contextHolder}

                <Breadcrumb className={styles.breadcrumb}>
                    <Breadcrumb.Item href="/">Accueil</Breadcrumb.Item>
                    <Breadcrumb.Item href="/event">Événements</Breadcrumb.Item>
                    <Breadcrumb.Item>{event.name}</Breadcrumb.Item>
                </Breadcrumb>

                <div className={styles.bannerContainer}>
                    <Carousel autoplay className={styles.carousel}>
                        {event.bannerUrl.map((url, index) => (
                            <div key={index}>
                                <div className={styles.bannerImage} style={{ backgroundImage: `url(${url})` }}>
                                    <div className={styles.bannerOverlay}>
                                        <div className={styles.bannerContent}>
                                            <Title level={1} className={styles.bannerTitle}>{event.name}</Title>
                                            {event.categorie && (
                                                <Tag icon={<HeartOutlined />} color={event.categorie.color} className={styles.categoryTag}>
                                                    {event.categorie.name}
                                                </Tag>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </div>

                <div className={styles.content}>
                    <Row gutter={[24, 24]}>
                        <Col xs={24} md={16}>
                            <Card className={styles.mainCard}>
                                <Tabs defaultActiveKey="1">
                                    <TabPane tab="À propos" key="1">
                                        <div className={styles.eventInfo}>
                                            <Title level={3}>Description</Title>
                                            <Paragraph>{event.description}</Paragraph>

                                            <Divider />

                                            <Title level={3}>Détails</Title>
                                            <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                                                <Descriptions.Item label={<><CalendarOutlined /> Date</>}>
                                                    {new Date(event.date).toLocaleDateString('fr-FR', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </Descriptions.Item>
                                                <Descriptions.Item label={<><PushpinOutlined /> Lieu</>}>
                                                    {event.location}
                                                </Descriptions.Item>
                                                {event.categorie && (
                                                    <Descriptions.Item label={<><HeartOutlined /> Catégorie</>}>
                                                        <Tag color={event.categorie.color}>{event.categorie.name}</Tag>
                                                    </Descriptions.Item>
                                                )}
                                                <Descriptions.Item label={<><UserOutlined /> Participants</>}>
                                                    {event.participants.length || 0} inscrits
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </div>
                                    </TabPane>
                                    <TabPane tab="Participants" key="2">
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={event.participants || []}
                                            renderItem={(participant : any) => (
                                                <List.Item>
                                                    <List.Item.Meta
                                                        avatar={<Avatar src={participant.avatar || null} icon={!participant.avatar && <UserOutlined />} />}
                                                        title={participant.name}
                                                        description={participant.email}
                                                    />
                                                </List.Item>
                                            )}
                                            locale={{ emptyText: "Aucun participant pour le moment" }}
                                        />
                                    </TabPane>
                                </Tabs>
                            </Card>
                        </Col>

                        <Col xs={24} md={8}>
                            <Card title="Ticket" className={styles.ticketCard}>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={event.tickets}
                                    renderItem={(ticket) => (
                                        <List.Item actions={[<Button type="primary" icon={<BookOutlined />} onClick={() => {
                                            setSelectedTicket(ticket)
                                            showModal(ticket)
                                        }}>Réserver</Button>]}>
                                            <List.Item.Meta
                                                avatar={<Avatar icon={<ContainerOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                                                title={ticket.name}
                                                description={`${ticket.price} €`}
                                            />
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
                <TicketBookingModal
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    event={event}
                    user={user}
                    // @ts-ignore
                    ticket={selectedTicket}
                    isUserLoggedIn={isLogged}
                />
            </div>
    );
};

EventDetailPage.getLayout = function getLayout(page : any) {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    );
}

export const getServerSideProps : GetServerSideProps <{
    event : Event | null
    user : User | null
}> = async (context) => {
    const cookies = context.req.headers.cookie || "";
    const parsedCookies = parse(cookies);
    setBearerToken(parsedCookies.JWT)
    let decoded = parsedCookies.JWT ? JSON.parse(atob(parsedCookies.JWT.split('.')[1])) : null

    const event = await Client.get(ROUTES.EVENT.CRUD + `/${context.query.id}`).then((res) => {
        return res.data
    }).catch(() => {
        return null
    })

    const user = await Client.get(ROUTES.USER.CRUD_BY_ID(decoded ? decoded.id : "")).then((res) => {
        return res.data
    }).catch(() => {
        return null
    })

    console.log(event)

    return { props: { event, user} }
}

export default EventDetailPage;