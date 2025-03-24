import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import {Button, Carousel, Flex} from 'antd';
import MainLayout from "@/components/layout/MainLayout";
import Title from "antd/es/typography/Title";
import {CSSProperties} from "react";
import EventDisplay from "@/components/eventDisplay/eventDisplay";
import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {User} from "@/types/user";
import {Event} from "@/types/event";
import {Categories} from "@/types/categories";
import {parse} from "cookie";
import Client, {setBearerToken} from "@/utils/client";
import {ROUTES} from "@/utils/routes";
import HandleError from "@/components/handleError/handleError";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const contentStyle: CSSProperties = {
    margin: 0,
    height: '500px',
    width: '100%',
    objectFit :"cover",
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
};

export default function Page({event}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
      <div className={styles.mainContainer}>
          <Flex justify={"center"} vertical={true} align={"center"} gap={0}>
              <Title style={{fontWeight : "700"}} level={2}>A la recherche d'un événement en particulier ?</Title>
              <p className={styles.minText}>pas de tracas on a tout ce qu'il faut</p>
          </Flex>
          <Carousel arrows autoplay infinite={true}>
              <div className={styles.imageWrapper}>
                  <img src={"https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29uY2VydHxlbnwwfHwwfHx8MA%3D%3D"} style={contentStyle}/>
                  <p>Concert</p>
              </div>
              <div className={styles.imageWrapper}>
                  <img src={"https://s3.playbpm.com.br/original_images/unnamed_WIXIdG2.jpg"} style={contentStyle}/>
                  <p>Festival</p>
              </div>
              <div className={styles.imageWrapper}>
                  <img src={"https://www.f1-fansite.com/wp-content/uploads/2023/05/SI202305280222.jpg"} style={contentStyle}/>
                  <p>Course</p>
              </div>
          </Carousel>
          {event === null ?
              <HandleError/>
          :
              <Flex justify={"center"} vertical={true} align={"center"} gap={12} style={{margin : "2rem 0"}}>
                  <Title style={{fontWeight : "700"}} level={2}>Les derniers événement</Title>
                  {event.slice(0, 5).map((event, index) => {
                        return <EventDisplay event={event} editMode={false}/>
                  })}
              </Flex>
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