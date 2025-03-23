import styles from './eventDisplay.module.css';
import {
    CalendarOutlined, CloseCircleOutlined,
    EditOutlined,
    EyeOutlined,
    HeartOutlined,
    PushpinOutlined,
    SendOutlined
} from "@ant-design/icons";
import {Button, message, Modal, Popover, Tag} from "antd";
import EyeIcon from "next/dist/client/components/react-dev-overlay/ui/icons/eye-icon";
import {Categories} from "@/types/categories";
import Client from "@/utils/client";
import {ROUTES} from "@/utils/routes";
import {useRouter} from "next/router";

const EventDisplay = (props : {id : string | undefined, title: string, description : string, imgUrl : string, category : Categories | undefined, date : Date, location : string, editMode : boolean}) => {
    const [modal, contextHolder] = Modal.useModal();
    const [messageApi, contextHolder2] = message.useMessage();
    const router = useRouter();

    return (
        <div className={styles.container}>
            {contextHolder}
            {contextHolder2}
            <div className={styles.imgWrapper}>
                <img src={props.imgUrl} alt="" />
            </div>
            <div className={styles.content}>
                <p className={styles.eventTitle}>{props.title}</p>
                <Popover content={<p>Categorie</p>}>
                    {props.category &&
                        <Tag icon={<HeartOutlined />} color={props.category.color}>{props.category.name}</Tag>
                    }
                </Popover>

                <p>{props.description}</p>

                <div className={styles.footer}>
                    <div>
                        <Popover content={<p>Date de l'événement</p>}>
                            <Tag icon={<CalendarOutlined />}>{new Date(props.date).toLocaleDateString()}</Tag>
                        </Popover>
                        <Popover content={<p>Lieu de l'événement</p>}>
                            <Tag icon={<PushpinOutlined />}>{props.location}</Tag>
                        </Popover>
                    </div>

                    {props.editMode ?
                        <div style={{display : "flex", gap : "8px"}}>
                            <Button variant={"filled"} color={"blue"} icon={<EyeOutlined/>} iconPosition={"end"}>Voir l'événement</Button>
                            <Button variant={"filled"} color={"green"} icon={<EditOutlined/>} iconPosition={"end"}>Modifier l'événement</Button>
                            <Button variant={"filled"} color={"red"} icon={<CloseCircleOutlined/>} iconPosition={"end"} onClick={() => {
                                modal.confirm({
                                    title: 'Êtes vous sûr de vouloir supprimer cet événement ?',
                                    content: 'Cette action est irréversible',
                                    okText: 'Oui',
                                    cancelText: 'Non',
                                    footer: (_, { OkBtn, CancelBtn }) => (
                                        <>
                                            <CancelBtn />
                                            <OkBtn/>
                                        </>
                                    ),
                                    onOk : () => {
                                        Client.delete(ROUTES.EVENT.CRUD + `/${props.id}`).then(() => {
                                            messageApi.success({
                                                type: "success",
                                                content: 'L\'événement a bien été supprimé'
                                            }).then(r => {
                                                router.reload();
                                            })
                                        }).catch(() => {
                                            messageApi.error({
                                                type: 'error',
                                                content: 'Une erreur est survenue lors de la suppression de l\'événement'
                                            })
                                        })
                                    }
                                });
                            }}>Supprimer l'événement</Button>
                        </div>
                    :
                        <Button variant={"filled"} color={"blue"} icon={<EyeOutlined/>} iconPosition={"end"}>Voir l'événement</Button>
                    }
                </div>
            </div>
        </div>
    );
}

export default EventDisplay;