import styles from "@/styles/Settings.module.css";
import MainLayout from "@/components/layout/MainLayout";
import {Avatar, Button, Flex, Form, FormProps, Input, Menu, MenuProps, message, Modal, Switch} from "antd";
import {MehOutlined, NotificationOutlined, UserOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import Client, {setBearerToken} from "@/utils/client";
import {parse} from "cookie";
import {ROUTES} from "@/utils/routes";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {User} from "@/types/user";
import {Event} from "@/types/event";
import {Categories} from "@/types/categories";
import {useRouter} from "next/router";
import CreateEventModal from "@/components/createEventModal/createEventModal";
import EventDisplay from "@/components/eventDisplay/eventDisplay";
import EditEventModal from "@/components/editEventModal/editEventModal";

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    { key: '/settings/profile', icon: <UserOutlined />, label: 'Profile' },
    { key: '/settings/event', icon: <NotificationOutlined />, label: 'Événement'},
];

export default function Page({user, event, categories}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [messageApi, contextHolder] = message.useMessage();
    const [userData, setUserData] = useState<User | null>(user)
    const [eventData, setEventData] = useState<Event[] | null>(event)
    const [current, setCurrent] = useState('/settings/event');
    const [createEventModalVisible, setCreateEventModalVisible] = useState(false);
    const [editEventModalVisible, setEditEventModalVisible] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [open, setOpen] = useState(false);

    const router = useRouter();

    type FieldType = {
        firstname?: string;
        lastname?: string;
        phone?: string;
    };

    const onClick: MenuProps['onClick'] = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
        router.push(e.key)
    };

    const handleCreateEvent = (values : any) => {
        console.log("create event")
        values.createdById = userData?.id;
        console.log(values)
        Client.post(ROUTES.EVENT.CRUD , values).then((res) => {
            console.log(res.data)
            // @ts-ignore
            setEventData([...eventData, res.data])
            setCreateEventModalVisible(false)

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
    }

    const handleEditEvent = (values : any) => {
        console.log("edit event")
        console.log(values)
        Client.put(ROUTES.EVENT.CRUD + `/${values.id}`, values).then((res) => {
            console.log(res.data)
            const newEventData = eventData?.map((event) => {
                if (event.id === res.data.id) {
                    return res.data as Event
                }
                return event as Event
            })
            // @ts-ignore
            setEventData(newEventData)
            setEditEventModalVisible(false)
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
    }

    console.log(eventData)

    return (
        <div className={styles.mainContainer}>
            {userData === null ?
                <div className={"loadError"}>
                    <MehOutlined color={"gray"} size={96}/>
                    <p>Erreur lors du chargement des informations réessayer plus tard</p>
                </div>
                :
                <div className={styles.settingContainer}>
                    {userData.role === "ROLE_ADMIN" || userData.role === "ROLE_PLANNER" &&
                        <div className={styles.menuContainer}>
                            <Menu
                                defaultSelectedKeys={['/settings/event']}
                                mode="inline"
                                theme="light"
                                onClick={onClick}
                                items={items}
                            />
                        </div>
                    }
                    <div className={styles.profileContainer}>
                        {contextHolder}
                        <h2>Vos événements</h2>
                        {eventData === null ?
                            <div className={"loadError"}>
                                <MehOutlined color={"gray"} size={96}/>
                                <p>Erreur lors du chargement des informations réessayer plus tard</p>
                            </div>
                            : eventData?.length === 0 ?
                            <div className={styles.noEventContainer}>
                                <p>Vous n'avez pas encore d'événements</p>
                                <Button type={"primary"} onClick={() => setCreateEventModalVisible(true)}>Créer un événement</Button>
                            </div>
                                :
                                <>
                                    <div style={{display : "flex", justifyContent: "flex-end", width: "100%"}}>
                                        <Button type={"primary"} onClick={() => setCreateEventModalVisible(true)}>Créer un événement</Button>
                                    </div>
                                    {eventData.map((event) => {
                                        return <EventDisplay
                                            event={event}
                                            editMode={true}
                                            selectedEvent={(event) => {
                                                setSelectedEvent(event)
                                                setEditEventModalVisible(true)
                                            }}
                                            key={event.id}
                                        />
                                    })}
                                </>
                        }
                    </div>
                </div>
            }


            <CreateEventModal
                open={createEventModalVisible}
                onFinish={handleCreateEvent}
                handleCancel={() => setCreateEventModalVisible(false)}
                handleOk={() => setCreateEventModalVisible(false)}
                categories={categories}
            />

            <EditEventModal
                open={editEventModalVisible}
                onFinish={handleEditEvent}
                handleCancel={() => setEditEventModalVisible(false)}
                handleOk={() => setEditEventModalVisible(false)}
                categories={categories}
                eventData={selectedEvent}
                />
        </div>
    );
}

Page.getLayout = function getLayout(page : any) {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    );
}

export const getServerSideProps : GetServerSideProps <{
    user : User | null
    event : Event[] | null
    categories : Categories[] | null
}> = async (context) => {
    const cookies = context.req.headers.cookie || "";
    const parsedCookies = parse(cookies);
    setBearerToken(parsedCookies.JWT)
    let decoded = parsedCookies.JWT ? JSON.parse(atob(parsedCookies.JWT.split('.')[1])) : null

    const user = await Client.get(ROUTES.USER.CRUD_BY_ID(decoded.id)).then((res) => {
        return res.data
    }).catch(() => {
        return null
    })

    const event = await Client.get(ROUTES.EVENT.GET_BY_USER_ID(decoded.id)).then((res) => {
        return res.data
    }).catch(() => {
        return null
    })

    const categories = await Client.get(ROUTES.CATEGORY.CRUD).then((res) => {
        return res.data
    }).catch(() => {
        return null
    })

    console.log(categories)

    return { props: { user , event, categories} }
}