import MainLayout from "@/components/layout/MainLayout";
import styles from "@/styles/Event.module.css";
import {Flex, Splitter, Checkbox, Select, DatePicker, Input} from "antd";
import Title from "antd/es/typography/Title";
import {SearchOutlined} from "@ant-design/icons";
import EventDisplay from "@/components/eventDisplay/eventDisplay";


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
    {
        title: "Grand Prix de Monaco",
        imgUrl: "https://cdn-imgix.headout.com/media/images/7d0797d8d3e5a6961697266f94016da9-Monaco%201.jpg",
        category: "Course",
        description: "Le Grand Prix de Monaco est une course de voiture qui se déroule sur un circuit de 5km",
        date: "12/12/2022",
        location: "Monaco",
    },
    {
        title : "Exposition de Paris",
        imgUrl : "https://www.connaissancedesarts.com/wp-content/thumbnails/uploads/2024/06/cda24_cr_petit_palais_street_art_we_are_here_mainok-1-tt-width-1200-height-900-fill-0-crop-1-bgcolor-ffffff.jpg",
        category : "Exposition",
        description : "L'exposition de Paris est une exposition d'art qui se déroule chaque année à Paris",
        date : "12/12/2022",
        location : "Paris",
    },
    {
        title : "Festival de Lille",
        imgUrl : "https://www.weo.fr/1672043218/v2awg0w5ucvj0ae8bhhcrpakh58g/VMF22_lille.jpg",
        category : "Festival",
        description : "Le festival de Lille est un festival de musique qui se déroule chaque année à Lille",
        date : "12/12/2022",
        location : "Lille",
    }
]


export default function Page() {
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
                    <Flex justify={"center"} vertical={true} align={"center"} gap={12}>
                        {data.map((item, index) => {
                            return <EventDisplay key={index} imgUrl={item.imgUrl} title={item.title} description={item.description} category={item.category} date={item.date} location={item.location}/>
                        })}
                    </Flex>
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