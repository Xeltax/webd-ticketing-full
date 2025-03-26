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
import FilterPanel from "@/components/filterPanel/filterPanel";

export default function Page({event}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [eventData, setEventData] = useState<Event[] | null>(event)

    return (
        <div className={styles.mainContainer}>
            <Flex justify={"center"} vertical={true} align={"center"} gap={0} style={{margin : "2rem 0"}}>
                <Title style={{fontWeight : "700"}} level={2}>Catalogue des événements</Title>
            </Flex>

            <div className={styles.wrapper}>
                <FilterPanel events={event} setFilteredEvents={(events) => setEventData(events)}/>
                <div className={styles.catalogueContainer}>
                    {event === null ?
                        <HandleError/>
                        :
                        <Flex justify={"center"} vertical={true} align={"center"} gap={12}>
                            {eventData && eventData.length > 0 ?
                            eventData.map((event, index) => {
                                return <EventDisplay event={event} editMode={false}/>
                            })
                            :
                            <Title level={3}>Aucun événement trouvé</Title>
                            }
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

    console.log(event)

    return { props: { event} }
}