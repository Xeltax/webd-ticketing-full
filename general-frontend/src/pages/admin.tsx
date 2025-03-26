import React, { useState, useEffect } from 'react';
import {
    Layout,
    Menu,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    Upload,
    message,
    Tag,
    Tabs,
    Card,
    Popconfirm, ColorPicker
} from 'antd';
import {
    UserOutlined,
    TagsOutlined,
    BookOutlined,
    EditOutlined,
    DeleteOutlined,
    PlusOutlined, ContainerOutlined, NotificationOutlined
} from '@ant-design/icons';
import { UploadOutlined } from '@ant-design/icons';
import {User} from "@/types/user";
import {Categories} from "@/types/categories";
import {Ticket} from "@/types/ticket";
import {Reservation} from "@/types/reservation";
import {Event} from "@/types/event";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {parse} from "cookie";
import Client, {setBearerToken} from "@/utils/client";
import {ROUTES} from "@/utils/routes";
import CreateEventModal from "@/components/createEventModal/createEventModal";
import EditEventModal from "@/components/editEventModal/editEventModal";
import {getCookie} from "cookies-next";
import {useRouter} from "next/router";

const { Header, Content, Sider } = Layout;

const AdminPanel = ({user, event, categories, reservation}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [activeKey, setActiveKey] = useState('users');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<any>(null);
    const [form] = Form.useForm();
    const router = useRouter();
    const parsedCookies = getCookie('JWT')
    let decoded = null;
    if (typeof parsedCookies === "string") {
        decoded = JSON.parse(atob(parsedCookies.split('.')[1]))
    }

    // États pour stocker les données
    const [users, setUsers] = useState<User[] | null>(user);
    const [events, setEvents] = useState<Event[] |null>(event);
    const [categoriesData, setCategoriesData] = useState<Categories[] | null>(categories);
    // const [tickets, setTickets] = useState<Ticket[]>([]);
    const [reservations, setReservations] = useState<Reservation[] | null>(reservation);

    const handleCreate = async (values: any) => {
        try {
            // Logique de création selon le type actif
            switch(activeKey) {
                case 'users':
                    Client.post(ROUTES.USER.CRUD, {...values, password : ""}).then((res) => {
                        messageApi.success('Utilisateur créé');
                        // @ts-ignore
                        setUsers([...users, res.data]);
                    }).catch((err) => {
                        messageApi.error('Erreur de création');
                    })
                    break;
                case 'events':
                    values.createdById = decoded?.id;
                    Client.post(ROUTES.EVENT.CRUD , values).then((res) => {
                        // @ts-ignore
                        setEvents([...events, res.data])

                        console.log(values)

                        const ticketData = values.tickets.map((ticket : {name : string, price : number}) => {
                            return {
                                name : ticket.name,
                                price : Number(ticket.price),
                                eventId : res.data.id
                            }
                        })
                        Client.post(ROUTES.TICKETS.CRUD, ticketData).then((res) => {
                            console.log(res.data)
                            messageApi.open({
                                type: 'success',
                                content: 'Votre événement a bien été créé',
                            });
                        }).catch(() => {
                            messageApi.open({
                                type: 'error',
                                content: 'Une erreur est survenue',
                            });
                        })
                    }).catch(() => {
                        messageApi.open({
                            type: 'error',
                            content: 'Une erreur est survenue',
                        });
                    })
                    break;
                case 'categories':
                    console.log(values.color.toHexString());
                    Client.post(ROUTES.CATEGORY.CRUD, {name : values.name, color : values.color.toHexString()}).then((res) => {
                        messageApi.success('Catégorie mise à jour');
                        // @ts-ignore
                        setCategoriesData([...categoriesData, res.data]);
                    }).catch((err) => {
                        messageApi.error('Erreur de création');
                    })
                    break;
                case 'reservation':
                    // await api.updateReservation(currentRecord.id, values);
                    messageApi.success('Réservation mise à jour');
                    break;
            }
            setIsModalVisible(false);
        } catch (error) {
            messageApi.error('Erreur de création');
        }
    };

    const handleUpdate = async (values: any) => {
        try {
            // Logique de mise à jour selon le type actif
            switch(activeKey) {
                case 'users':
                    Client.put(ROUTES.USER.CRUD, {...values, id : currentRecord.id}).then((res) => {
                        messageApi.success('Utilisateur mis à jour');
                        // @ts-ignore
                        users?.forEach((item) => {
                            if (item.id === currentRecord.id) {
                                const index = users?.indexOf(item);
                                users[index] = res.data;
                            }
                            setUsers([...users]);
                        })
                    }).catch((err) => {
                        messageApi.error('Erreur de mise à jour');
                    })
                    break;
                case 'events':
                    Client.put(ROUTES.EVENT.CRUD + `/${values.id}`, values).then((res) => {
                        console.log(res.data)
                        const newEventData = events?.map((event) => {
                            if (event.id === res.data.id) {
                                return res.data as Event
                            }
                            return event as Event
                        })
                        // @ts-ignore
                        setEvents(newEventData)
                        messageApi.open({
                            type: 'success',
                            content: 'Votre événement a bien été modifié',
                        });
                    }).catch(() => {
                        messageApi.open({
                            type: 'error',
                            content: 'Une erreur est survenue',
                        });
                    })
                    break;
                case 'categories':
                    const color = typeof values.color === "string" ? values.color : values.color.toHexString();
                    Client.put(ROUTES.CATEGORY.CRUD, {data : {id: currentRecord.id, name : values.name, color : color}}).then(() => {
                        messageApi.success('Catégorie mise à jour');
                        categoriesData?.forEach((item) => {
                            if (item.id === currentRecord.id) {
                                const index = categoriesData.indexOf(item);
                                categoriesData[index] = {id: currentRecord.id, name : values.name, color : color};
                            }
                            setCategoriesData([...categoriesData]);
                        })
                    }).catch(() => {
                        messageApi.error('Erreur de suppression');
                    })
                    break;
                case 'reservation':
                    // await api.updateReservation(currentRecord.id, values);
                    messageApi.success('Réservation mise à jour');
                    break;
            }
            setIsModalVisible(false);
        } catch (error) {
            messageApi.error('Erreur de mise à jour');
        }
    };

    console.log(activeKey)

    const handleDelete = async (id: string) => {
        try {
            // Logique de suppression selon le type actif
            switch(activeKey) {
                case 'users':
                    Client.delete(ROUTES.USER.CRUD, {data : {id: id}}).then(() => {
                        messageApi.success('Utilisateur supprimé');
                        users?.forEach((item) => {
                            if (item.id === id) {
                                const index = users.indexOf(item);
                                users.splice(index, 1);
                            }
                            setUsers([...users]);
                        })
                    }).catch((err) => {
                        messageApi.error('Erreur de suppression');
                    })
                    break;
                case 'events':
                    Client.delete(ROUTES.EVENT.CRUD + `/${currentRecord.id}`).then(() => {
                        messageApi.success({
                            type: "success",
                            content: 'L\'événement a bien été supprimé'
                        })
                        // @ts-ignore
                        setEvents(events?.filter((event) => event.id !== currentRecord.id))
                    }).catch(() => {
                        messageApi.error({
                            type: 'error',
                            content: 'Une erreur est survenue lors de la suppression de l\'événement'
                        })
                    })
                    break;
                case 'categories':
                    Client.delete(ROUTES.CATEGORY.CRUD, {data : {id: id}}).then(() => {
                        messageApi.success('Catégorie mise à jour');
                        categoriesData?.forEach((item) => {
                            if (item.id === id) {
                                const index = categoriesData.indexOf(item);
                                categoriesData.splice(index, 1);
                            }
                            setCategoriesData([...categoriesData]);
                        })
                    }).catch(() => {
                        messageApi.error('Erreur de suppression');
                    })
                    break;
                case 'reservations':
                    Client.delete(ROUTES.RESERVATION.CRUD + `/${id}`).then(() => {
                        messageApi.success('Réservation mise à jour');
                        // @ts-ignore
                        setReservations(reservations?.filter((reservation) => reservation.id !== id));
                    }).catch(() => {
                        messageApi.error('Erreur de suppression');
                    })
                    break;
            }
        } catch (error) {
            console.log(error)
            messageApi.error('Erreur de suppression');
        }
    };

    // Colonnes de tableau pour chaque type de données
    const userColumns = [
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Rôle', dataIndex: 'role', key: 'role' },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: User) => (
                <div>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            setCurrentRecord(record);
                            form.setFieldsValue(record);
                            setIsModalVisible(true);
                        }}
                    />
                    {/*<Popconfirm*/}
                    {/*    title="Confirmer la suppression"*/}
                    {/*    onConfirm={() => handleDelete(record.email)}*/}
                    {/*>*/}
                    {/*    <Button icon={<DeleteOutlined />} danger />*/}
                    {/*</Popconfirm>*/}
                </div>
            )
        }
    ];

    const reservationColumns = [
        { title: 'Email', key: 'userId', render : (record : any) => record.user.email},
        { title: 'Événement', key: 'event',  render : (record : any) => record.event.name },
        { title: 'Tickets', key: 'ticket',  render : (record : any) => record.ticket.name },
        { title: 'Prix', key: 'price', render : (record : any) => `${record.ticket.price} €` },
        { title: 'Date', dataIndex: 'createdAt', key: 'createdAt', render: (date: Date) => new Date(date).toLocaleDateString() },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: Reservation) => (
                <div>
                    <Popconfirm
                        title="Confirmer la suppression"
                        onConfirm={() => handleDelete(record.id || '')}
                    >
                        <Button icon={<DeleteOutlined />} danger onClick={() => {
                            setCurrentRecord(record);
                        }}/>
                    </Popconfirm>
                </div>
            )
        }
    ];

    const eventColumns = [
        { title: 'Nom', dataIndex: 'name', key: 'name' },
        { title: 'Date', dataIndex: 'date', key: 'date', render: (date: Date) => new Date(date).toLocaleDateString() },
        { title: 'Lieu', dataIndex: 'location', key: 'location' },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: Event) => (
                <div>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            setCurrentRecord(record);
                            form.setFieldsValue(record);
                            setIsModalVisible(true);
                        }}
                    />
                    <Popconfirm
                        title="Confirmer la suppression"
                        onConfirm={() => handleDelete(record.id || '')}
                    >
                        <Button icon={<DeleteOutlined />} danger onClick={() => {
                            setCurrentRecord(record);
                        }} />
                    </Popconfirm>
                </div>
            )
        }
    ];

    const categoryColumns = [
        { title: 'Nom', dataIndex: 'name', key: 'name' },
        { title : 'couleur' , key : 'color', render : (record : Categories) => <Tag color={record.color}>{record.color}</Tag>},
        {
            title: 'Actions',
            key: 'actions',
            render: (record: Categories) => (
                <div>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            setCurrentRecord(record);
                            form.setFieldsValue(record);
                            setIsModalVisible(true);
                        }}
                    />
                    <Popconfirm
                        title="Confirmer la suppression"
                        onConfirm={() => handleDelete(record.id || '')}
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </div>
            )
        }
    ];

    // Formulaire dynamique selon le type d'entité
    const renderForm = () => {
        switch(activeKey) {
            case 'users':
                return (
                    <Form form={form} layout="vertical" onFinish={currentRecord ? handleUpdate : handleCreate}>
                        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="role" label="Rôle" rules={[{ required: true }]}>
                            <Select>
                                <Select.Option value="ROLE_USER">Utilisateur</Select.Option>
                                <Select.Option value="ROLE_PLANNER">Organisateur</Select.Option>
                                <Select.Option value="ROLE_ADMIN">Admin</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="firstName" label="Prénom">
                            <Input />
                        </Form.Item>
                        <Form.Item name="lastName" label="Nom">
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                {currentRecord ? 'Mettre à jour' : 'Créer'}
                            </Button>
                        </Form.Item>
                    </Form>
                );
            case "categories":
                return (
                    <Form form={form} layout="vertical" onFinish={currentRecord ? handleUpdate : handleCreate}>
                        <Form.Item name="name" label="Nom" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="color"
                            label="Couleur"
                            rules={[{ required: true, message: 'color is required!' }]}
                        >
                            <ColorPicker format={'hex'} />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                {currentRecord ? 'Mettre à jour' : 'Créer'}
                            </Button>
                        </Form.Item>
                    </Form>
                )
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {contextHolder}
            <Sider width={200}>
                <Button type={"primary"} color={"danger"} style={{margin : "1rem 0" ,display : "flex", justifyContent : "center", width : "100%"}} onClick={() => router.push("/")}>Retour à l'application</Button>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['users']}
                    onSelect={({ key }) => setActiveKey(key)}
                >
                    <Menu.Item key="users" icon={<UserOutlined />}>Utilisateurs</Menu.Item>
                    <Menu.Item key="events" icon={<NotificationOutlined />}>Événements</Menu.Item>
                    <Menu.Item key="categories" icon={<TagsOutlined />}>Catégories</Menu.Item>
                    <Menu.Item key="reservations" icon={<BookOutlined />}>Réservations</Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: '0 16px' }}>
                    <h1>Panel d'Administration</h1>
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
                    <Card
                        title={`Gestion des ${activeKey}`}
                        extra={
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    setCurrentRecord(null);
                                    form.resetFields();
                                    setIsModalVisible(true);
                                }}
                            >
                                Ajouter
                            </Button>
                        }
                    >
                        <Table
                            columns={activeKey === 'users' ? userColumns : activeKey === 'events' ? eventColumns : activeKey === "categories" ? categoryColumns : reservationColumns}
                            // @ts-ignore
                            dataSource={activeKey === 'users' ? users : activeKey === 'events' ? events : activeKey === "categories" ? categoriesData : reservations}
                        />
                    </Card>

                    {activeKey === 'events' ?
                        currentRecord ?
                            <EditEventModal
                                open={isModalVisible}
                                handleOk={() => setIsModalVisible(!isModalVisible)}
                                handleCancel={() => setIsModalVisible(!isModalVisible)}
                                onFinish={handleUpdate}
                                categories={categoriesData}
                                eventData={currentRecord}
                            />
                            :
                            <CreateEventModal
                                open={isModalVisible}
                                handleOk={() => setIsModalVisible(!isModalVisible)}
                                handleCancel={() => setIsModalVisible(!isModalVisible)}
                                onFinish={handleCreate}
                                categories={categoriesData}
                            />
                        :
                        <Modal
                            title={`${currentRecord ? 'Modifier' : 'Ajouter'} un ${activeKey.slice(0, -1)}`}
                            open={isModalVisible}
                            onCancel={() => setIsModalVisible(false)}
                            footer={null}
                        >
                            {renderForm()}
                        </Modal>

                    }

                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminPanel;

export const getServerSideProps : GetServerSideProps <{
    user : User[] | null
    event : Event[] | null
    categories : Categories[] | null
    reservation : Reservation[] | null
}> = async (context) => {
    const cookies = context.req.headers.cookie || "";
    const parsedCookies = parse(cookies);
    setBearerToken(parsedCookies.JWT)
    let decoded = parsedCookies.JWT ? JSON.parse(atob(parsedCookies.JWT.split('.')[1])) : null

    if (decoded.role !== "ROLE_ADMIN") {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }

    const user = await Client.get(ROUTES.USER.CRUD).then((res) => {
        console.log(res)
        return res.data
    }).catch(() => {
        return null
    })

    console.log(user)

    const event = await Client.get(ROUTES.EVENT.CRUD).then((res) => {
        return res.data
    }).catch(() => {
        return null
    })

    const categories = await Client.get(ROUTES.CATEGORY.CRUD).then((res) => {
        return res.data
    }).catch(() => {
        return null
    })


    const reservation = await Client.get(ROUTES.RESERVATION.CRUD).then((res) => {
        return res.data
    }).catch(() => {
        return null
    })

    return { props: { user, event, categories, reservation} }
}