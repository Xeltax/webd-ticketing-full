import MainLayout from "@/components/layout/MainLayout";
import styles from "@/styles/Event.module.css";
import {Flex, Splitter, Checkbox, Select, DatePicker, Input} from "antd";
import Title from "antd/es/typography/Title";
import {SearchOutlined} from "@ant-design/icons";
import EventDisplay from "@/components/eventDisplay/eventDisplay";
import HandleError from "@/components/handleError/handleError";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {Event} from "@/types/event";
import {parse} from "cookie";
import Client, {setBearerToken} from "@/utils/client";
import {ROUTES} from "@/utils/routes";
import {useState} from "react";

export default function Page({event}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [eventData, setEventData] = useState<Event[] | null>(event)
    const plainOptions = ['Apple', 'Pear', 'Orange'];

    const onChange = (checkedValues : any) => {
        console.log('checked = ', checkedValues);
    }

    const onSearch = (values: any) => {
        console.log("values", values)
    }

    return (
        <div className={styles.mainContainer}>
            <Flex justify={"center"} vertical={true} align={"center"} gap={0} style={{margin : "2rem 0"}}>
                <Title style={{fontWeight : "700"}} level={2}>Catalogue des événements</Title>
            </Flex>

            <div className={styles.wrapper}>
                <div className={styles.filterPanelContainer}>
                    <div className={styles.filterPanel}>
                        <p className={styles.panelTitle}>Filtre</p>
                        <div className={styles.filterPanelModule}>
                            <p className={styles.filterPanelModuleText}>Recherche</p>
                            <Input addonBefore={<SearchOutlined />} placeholder="Chercher un événement" />
                        </div>
                        <div className={styles.filterPanelModule}>
                            <p className={styles.filterPanelModuleText}>Catégorie</p>
                            <Checkbox.Group options={plainOptions} defaultValue={['Apple']} onChange={onChange} style={{display : "flex", flexDirection : "column"}} />
                        </div>

                        <div className={styles.filterPanelModule}>
                            <p className={styles.filterPanelModuleText}>Date</p>
                            <DatePicker placeholder={"Choisissez une date"} onChange={onChange} style={{ width: '100%' }}/>
                        </div>


                        <div className={styles.filterPanelModule}>
                            <p className={styles.filterPanelModuleText}>Lieu</p>
                            <Select
                                showSearch
                                placeholder="Choisir une ville"
                                optionFilterProp="label"
                                style={{ width: "100%" }}
                                onChange={onChange}
                                onSearch={onSearch}
                                options={[
                                    {
                                        value: 'paris',
                                        label: 'Paris',
                                    },
                                    {
                                        value: 'canne',
                                        label: 'Cannes',
                                    },
                                    {
                                        value: 'caen',
                                        label: 'Caen',
                                    },
                                ]}
                            />
                        </div>

                    </div>
                </div>
                <div className={styles.catalogueContainer}>
                    {eventData === null ?
                        <HandleError/>
                        :
                        <Flex justify={"center"} vertical={true} align={"center"} gap={12}>
                            {eventData.map((event, index) => {
                                return <EventDisplay event={event} editMode={false}/>
                            })}
                        </Flex>
                    }
                </div>
            </div>
        </div>
    )
}

Page.getLayout = function getLayout(page : any) {
    return (
        <MainLayout>
            {page}
        </MainLayout>
    );
}

export const getServerSideProps : GetServerSideProps <{
    event : Event[] | null
}> = async (context) => {
    const cookies = context.req.headers.cookie || "";
    const parsedCookies = parse(cookies);
    setBearerToken(parsedCookies.JWT)
    let decoded = parsedCookies.JWT ? JSON.parse(atob(parsedCookies.JWT.split('.')[1])) : null

    const event = await Client.get(ROUTES.EVENT.CRUD).then((res) => {
        return res.data
    }).catch(() => {
        return null
    })

    return { props: { event} }
}