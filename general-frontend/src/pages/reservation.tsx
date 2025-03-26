import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {parse} from "cookie";
import Client, {setBearerToken} from "@/utils/client";
import {ROUTES} from "@/utils/routes";
import MainLayout from "@/components/layout/MainLayout";
import Title from "antd/es/typography/Title";
import {Col, Row, Typography} from "antd";
import ReservationCard from "@/components/reservationCard/reservationCard";
import {useEffect, useState} from "react";
import {Reservation} from "@/types/reservation";
import {Ticket} from "@/types/ticket";
import {Event} from "@/types/event";
import HandleError from "@/components/handleError/handleError";

export default function Page({reservation}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [reservations, setReservations] = useState<Reservation[] | null>(reservation ? reservation : null);

    return (
        <div style={{ padding: 24 }}>
            <Title level={2}>Mes Billets</Title>
            {reservations === null ?
                <HandleError/>
                :
                reservations.length === 0 ? (
                    <Typography>Aucune billet trouvée</Typography>
                ) : (
                    <Row gutter={[16, 16]}>
                        {reservations.map(({ createdAt, event, ticket }, index) => (
                            <Col key={index} xs={24} sm={12} md={8} lg={6}>
                                <ReservationCard
                                    createdAt={createdAt}
                                    event={event}
                                    ticket={ticket}
                                />
                            </Col>
                        ))}
                    </Row>
                )
            }
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
    reservation : Reservation[] | null
}> = async (context) => {
    const cookies = context.req.headers.cookie || "";
    const parsedCookies = parse(cookies);
    setBearerToken(parsedCookies.JWT)
    let decoded = parsedCookies.JWT ? JSON.parse(atob(parsedCookies.JWT.split('.')[1])) : null

    const reservation = await Client.get(ROUTES.RESERVATION.CRUD_BY_ID(decoded.id)).then((res) => {
        return res.data
    }).catch(() => {
        return null
    })

    return { props: { reservation} }
}