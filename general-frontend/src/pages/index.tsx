import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import {Button, Carousel, Flex} from 'antd';
import MainLayout from "@/components/layout/MainLayout";
import Title from "antd/es/typography/Title";
import {CSSProperties} from "react";
import EventDisplay from "@/components/eventDisplay/eventDisplay";

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

const data = [
    {
        title : "GP Explorer",
        imgUrl : "https://i.ytimg.com/vi/PHMgMrQ4VxY/maxresdefault.jpg",
        category : "Course",
        description : "Le GP Explorer est une course de voiture qui se déroule sur un circuit de 5km",
        date : "12/12/2022",
        location : "Paris",
    },
    {
        title : "Festival de Cannes",
        imgUrl : "https://img.nrj.fr/qEPujaUoSqRS7kxgd9ycGD_diNw=/medias%2F2022%2F12%2Fxxbtkkdgt2jpvziw1mrlqpfzvy7-mrshfyvtha0k1hw_63ad6e2a1fd13.jpg?isVideoThumbnail=1",
        category : "Festival",
        description : "Le festival de Cannes est un festival de cinéma qui se déroule chaque année à Cannes",
        date : "12/12/2022",
        location : "Cannes",
    },
]

export default function Page() {
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
          <Flex justify={"center"} vertical={true} align={"center"} gap={12} style={{marginTop : "2rem"}}>
              <Title style={{fontWeight : "700"}} level={2}>Les derniers événement</Title>
              {data.map((item, index) => {
                    return <EventDisplay key={index} imgUrl={item.imgUrl} title={item.title} description={item.description} category={item.category} date={item.date} location={item.location}/>
              })}
          </Flex>
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