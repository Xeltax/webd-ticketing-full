import styles from './eventDisplay.module.css';
import {CalendarOutlined, EyeOutlined, HeartOutlined, PushpinOutlined, SendOutlined} from "@ant-design/icons";
import {Button, Popover, Tag} from "antd";
import EyeIcon from "next/dist/client/components/react-dev-overlay/ui/icons/eye-icon";

const EventDisplay = (props : {title: string, description : string, imgUrl : string, category : string, date : string, location : string}) => {

    const categoryColor = () => {
        switch (props.category) {
            case "Course":
                return "green";
            case "Festival":
                return "red";
            case "Concert":
                return "blue";
            case "Exposition":
                return "purple";
            default:
                return "grey";
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.imgWrapper}>
                <img src={props.imgUrl} alt="" />
            </div>
            <div className={styles.content}>
                <p className={styles.eventTitle}>{props.title}</p>
                <Popover content={<p>Categorie</p>}>
                    <Tag icon={<HeartOutlined />} color={categoryColor()}>{props.category}</Tag>
                </Popover>

                <p>{props.description}</p>

                <div className={styles.footer}>
                    <div>
                        <Popover content={<p>Date de l'événement</p>}>
                            <Tag icon={<CalendarOutlined />}>{props.date}</Tag>
                        </Popover>
                        <Popover content={<p>Lieu de l'événement</p>}>
                            <Tag icon={<PushpinOutlined />}>{props.location}</Tag>
                        </Popover>
                    </div>

                    <Button variant={"filled"} color={"blue"} icon={<EyeOutlined/>} iconPosition={"end"}>Voir l'événement</Button>
                </div>
            </div>
        </div>
    );
}

export default EventDisplay;