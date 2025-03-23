import React, {useEffect, useState} from 'react';
import {Avatar, Button, Flex, Layout, Menu, Popover, theme} from 'antd';
import {DesktopOutlined, LogoutOutlined, UserOutlined} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import {useRouter} from "next/router";
import {getCookie} from "cookies-next";
const { Header, Content, Footer } = Layout;


const items = [
    {key : "/", label : "Accueil"},
    {key : "/event", label : "Les events"},
]

const MainLayout = (props : {children : any}) => {
    const router = useRouter();
    const [current, setCurrent] = useState(router.pathname);
    const [isLogged, setIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = getCookie("JWT")
        if (typeof token === "string") {
            const decoded = token ? JSON.parse(atob(token.split('.')[1])) : null
            if (decoded) {
                setIsAdmin(decoded.role === "ROLE_ADMIN")
            }
        }

        if (token) {
            setIsLogged(true)
        } else {
            setIsLogged(false)
        }
    }, [])

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleLogout = () => {
        document.cookie = "JWT=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        setIsLogged(false)
    }

    const content = (
        <>
            <Flex vertical gap="small" style={{ width: '100%' }}>
                <Button block icon={<UserOutlined />} onClick={() => router.push("/settings/profile")}>Profile</Button>
                {isAdmin && <Button block icon={<DesktopOutlined />} onClick={() => router.push("/admin")}>Administration</Button>}
                <Button block icon={<LogoutOutlined />} onClick={handleLogout}>Déconnexion</Button>
            </Flex>
        </>
    )

    return (
        <Layout>
            <Header
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <div className="demo-logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    selectedKeys={[current]}
                    onClick={(e) => {
                        console.log("e.key", e.key)
                        setCurrent(() => e.key)
                        router.push(e.key)
                    }}
                    items={items}
                    style={{ flex: 1, minWidth: 0 }}
                />
                {isLogged ?
                    <Popover content={content} title="Paramètre">
                        <Avatar size={48} icon={<UserOutlined />} style={{backgroundColor: "#1677ff"}} />
                    </Popover>
                    :
                    <Button type={"primary"} onClick={() => router.push("/login")}>Connexion</Button>
                }
            </Header>
            <Content style={{ padding: '0 48px' }}>
                {props.children}
            </Content>
            {/*<Footer style={{ textAlign: 'center' }}>*/}
            {/*    Ticketing ©{new Date().getFullYear()} Created by Clément Honoré*/}
            {/*</Footer>*/}
        </Layout>
    );
};

export default MainLayout;