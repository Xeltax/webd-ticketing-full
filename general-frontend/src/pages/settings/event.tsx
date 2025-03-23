import styles from "@/styles/Settings.module.css";
import MainLayout from "@/components/layout/MainLayout";
import {Avatar, Button, Flex, Form, FormProps, Input, Menu, MenuProps, message, Switch} from "antd";
import {MehOutlined, NotificationOutlined, UserOutlined} from "@ant-design/icons";
import React, {useEffect, useState} from "react";
import Client, {setBearerToken} from "@/utils/client";
import {parse} from "cookie";
import {ROUTES} from "@/utils/routes";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {User} from "@/types/user";
import {useRouter} from "next/router";

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    { key: '/settings/profile', icon: <UserOutlined />, label: 'Profile' },
    { key: '/settings/event', icon: <NotificationOutlined />, label: 'Événement'},
];

export default function Page({user}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [messageApi, contextHolder] = message.useMessage();
    const [userData, setUserData] = useState<User | null>(user)
    const [editMode, setEditMode] = useState(true)
    const [current, setCurrent] = useState('/settings/event');
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

    const handleSubmit: FormProps<FieldType>['onFinish'] = (values) => {
        if (userData !== null && userData.id) {
            const data = {
                id : userData.id,
                firstName: values.firstname,
                lastName: values.lastname,
                phone: values.phone
            }
            console.log(data)

            Client.put(ROUTES.USER.CRUD, data).then((res) => {
                console.log(res.data)
                setUserData(res.data)
                setEditMode(true)
                messageApi.open({
                    type: 'success',
                    content: 'Vos informations ont bien été modifiées',
                });
            }).catch(() => {
                messageApi.open({
                    type: 'error',
                    content: 'Une erreur est survenue',
                });
                setUserData(null)
            })
        }
    }

    const roleDisplay = () => {
        if (userData) {
            if (userData.role === "ROLE_ADMIN") {
                return "Administrateur"
            } else if (userData.role === "ROLE_USER") {
                return "Utilisateur"
            } else if (userData.role === "ROLE_PLANNER") {
                return "Organisateur"
            } else {
                return "Inconnu"
            }
        }
    }

    const handleRoleChange = () => {
        if (userData !== null && userData.id) {
            const data = {
                id : userData.id,
                role: "ROLE_PLANNER"
            }
            console.log(data)

            Client.put(ROUTES.USER.CRUD, data).then((res) => {
                console.log(res.data)
                setUserData(res.data)
                messageApi.open({
                    type: 'success',
                    content: 'Vous êtes désormais organisateur',
                });
            }).catch(() => {
                messageApi.open({
                    type: 'error',
                    content: 'Une erreur est survenue',
                });
                setUserData(null)
            })
        }
    }

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
                    </div>
                </div>
            }
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

    return { props: { user } }
}