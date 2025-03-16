import React, {useState} from 'react';
import {Avatar, Button, Flex, Layout, Menu, Popover, theme} from 'antd';
import {LogoutOutlined, UserOutlined} from '@ant-design/icons';
import type { MenuProps } from 'antd';
const { Header, Content, Footer } = Layout;


const items = [
    {key : "home", label : "Accueil"},
    {key : "event", label : "Les events"},
]

const MainLayout = (props : {children : any}) => {
    const [current, setCurrent] = useState('home');
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const content = (
        <>
            <Flex vertical gap="small" style={{ width: '100%' }}>
                <Button block icon={<UserOutlined />}>Profile</Button>
                <Button block icon={<LogoutOutlined />}>Déconnexion</Button>
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
                        setCurrent(() => e.key)
                    }}
                    items={items}
                    style={{ flex: 1, minWidth: 0 }}
                />
                <Popover content={content} title="Paramètre">
                    <Avatar size={48} icon={<UserOutlined />} style={{backgroundColor: "#1677ff"}} />
                </Popover>
            </Header>
            <Content style={{ padding: '0 48px' }}>
                {props.children}
            </Content>
            {/*<Footer style={{ textAlign: 'center' }}>*/}
            {/*    Ticketing ©{new Date().getFullYear()} Created by Ant UED*/}
            {/*</Footer>*/}
        </Layout>
    );
};

export default MainLayout;