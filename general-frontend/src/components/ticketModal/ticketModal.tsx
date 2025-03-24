import React, { useState, useEffect } from 'react';
import {
    Modal,
    Steps,
    Button,
    Form,
    Input,
    InputNumber,
    Divider,
    Typography,
    Radio,
    Result,
    message,
    Row,
    Col
} from 'antd';
import {
    UserOutlined,
    CalendarOutlined,
    PushpinOutlined,
    CreditCardOutlined,
    CheckCircleOutlined,
    UserAddOutlined,
    LoginOutlined, ContainerOutlined, PhoneOutlined, MailOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import styles from './TicketModal.module.css';
import {User} from "@/types/user";
import {Event} from "@/types/event";
import {Ticket} from "@/types/ticket";
import Client from "@/utils/client";
import {ROUTES} from "@/utils/routes";

const { Text, Title } = Typography;
const { Step } = Steps;

const TicketBookingModal = (props : {
    visible : boolean,
    onCancel : () => void,
    event : Event,
    user : User | null,
    ticket : Ticket,
    isUserLoggedIn : boolean
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();

    // Réinitialiser les valeurs lorsque la modale s'ouvre
    useEffect(() => {
        if (props.visible) {
            setCurrentStep(0);
            setQuantity(1);
            form.resetFields();
        }
    }, [props.visible, form]);

    const nextStep = () => {
        // Si l'utilisateur n'est pas connecté et qu'on passe à l'étape des informations personnelles
        if (!props.isUserLoggedIn && currentStep === 0) {
            messageApi.info('Vous devez être connecté pour continuer la réservation.');
            return;
        }
        setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleBooking = () => {
        const data = {
            userId: props.user?.id,
            eventId: props.event?.id,
            ticketId: props.ticket?.id,
        }

        Client.post(ROUTES.RESERVATION.CRUD, data).then((response) => {
            console.log(response);
        })

        messageApi.success('Votre réservation a été prise en compte !');
        setCurrentStep(3); // Passer à l'écran de confirmation
    };

    const redirectToLogin = () => {
        router.push(`/login?redirect=${encodeURIComponent(`/eventDetail/${props.event.id}`)}`);
        props.onCancel();
    };

    const redirectToRegister = () => {
        router.push(`/register?redirect=${encodeURIComponent(`/eventDetail/${props.event.id}`)}`);
        props.onCancel();
    };

    const renderLoginPrompt = () => {
        return (
            <div className={styles.loginPrompt}>
                <Result
                    icon={<LoginOutlined />}
                    title="Connexion requise"
                    subTitle="Vous devez être connecté pour réserver des billets"
                    extra={[
                        <Button type="primary" key="login" onClick={redirectToLogin}>
                            Se connecter
                        </Button>,
                        <Button key="register" onClick={redirectToRegister}>
                            Créer un compte
                        </Button>
                    ]}
                />
            </div>
        );
    };

    const renderStepContent = () => {
        if (!props.isUserLoggedIn) {
            return renderLoginPrompt();
        }

        switch (currentStep) {
            case 0:
                return (
                    <div className={styles.ticketSelectionStep}>
                        <div className={styles.ticketCard}>
                            <div className={styles.ticketHeader}>
                                <ContainerOutlined className={styles.ticketIcon} />
                                <div>
                                    <Text strong className={styles.ticketName}>{props.ticket?.name}</Text>
                                    <div className={styles.ticketPrice}>{props.ticket?.price} €</div>
                                </div>
                            </div>

                            <Divider />

                            <div className={styles.ticketDetails}>
                                <div className={styles.ticketInfo}>
                                    <CalendarOutlined /> {new Date(props.event.date).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
                                </div>
                                <div className={styles.ticketInfo}>
                                    <PushpinOutlined /> {props.event.location}
                                </div>
                            </div>

                            <div className={styles.quantitySelector}>
                                <Text strong>Quantité</Text>
                                <InputNumber
                                    min={1}
                                    max={10}
                                    value={quantity}
                                    // @ts-ignore
                                    onChange={setQuantity}
                                    className={styles.quantityInput}
                                />
                            </div>

                            <div className={styles.ticketTotal}>
                                <Text strong>Total</Text>
                                <Text strong className={styles.totalPrice}>{(props.ticket?.price * quantity).toFixed(2)} €</Text>
                            </div>
                        </div>
                    </div>
                );
            case 1:
                return (
                    <Form form={form} layout="vertical">
                        <div className={styles.personalInfoStep}>
                            <Title level={4} className={styles.stepTitle}>Informations personnelles</Title>

                            {props.user &&
                                <>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <Form.Item label="Prénom" name="firstName" initialValue={props.user.firstName} rules={[{ required: true, message: 'Veuillez entrer votre prénom' }]}>
                                                <Input prefix={<UserOutlined />} placeholder="Prénom" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12}>
                                            <Form.Item label="Nom" name="lastName" initialValue={props.user.lastName} rules={[{ required: true, message: 'Veuillez entrer votre nom' }]}>
                                                <Input prefix={<UserOutlined />} placeholder="Nom" />
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                    <Form.Item label="Email" name="email" rules={[
                                        { required: true, message: 'Veuillez entrer votre email' },
                                        { type: 'email', message: 'Veuillez entrer un email valide' }
                                    ]} initialValue={props.user.email}>
                                        <Input prefix={<MailOutlined />} placeholder="Email" />
                                    </Form.Item>

                                    <Form.Item label="Téléphone" name="phone" initialValue={props.user.phone}>
                                        <Input prefix={<PhoneOutlined />} placeholder="Téléphone" />
                                    </Form.Item>
                                </>
                            }

                            {quantity > 1 && (
                                <>
                                    <Divider orientation="left">Informations sur les autres participants</Divider>

                                    {Array.from({ length: quantity - 1 }).map((_, index) => (
                                        <div key={index} className={styles.additionalParticipant}>
                                            <Title level={5}>Participant {index + 2}</Title>
                                            <Row gutter={16}>
                                                <Col span={12}>
                                                    <Form.Item label="Prénom" name={`guest_${index}_firstName`}>
                                                        <Input prefix={<UserAddOutlined />} placeholder="Prénom" />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12}>
                                                    <Form.Item label="Nom" name={`guest_${index}_lastName`}>
                                                        <Input prefix={<UserAddOutlined />} placeholder="Nom" />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </Form>
                );
            case 2:
                return (
                    <div className={styles.paymentStep}>
                        <Title level={4} className={styles.stepTitle}>Méthode de paiement</Title>

                        <Radio.Group defaultValue="card" className={styles.paymentOptions}>
                            <Radio.Button value="card" className={styles.paymentOption}>
                                <CreditCardOutlined className={styles.paymentIcon} />
                                <div>
                                    <div>Carte bancaire</div>
                                    <div className={styles.paymentSubtext}>Visa, Mastercard, CB</div>
                                </div>
                            </Radio.Button>
                        </Radio.Group>

                        <div className={styles.cardForm}>
                            <Form layout="vertical">
                                <Form.Item label="Numéro de carte" required>
                                    <Input placeholder="1234 5678 9012 3456" />
                                </Form.Item>

                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item label="Date d'expiration" required>
                                            <Input placeholder="MM/AA" />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="CVC" required>
                                            <Input placeholder="123" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item label="Nom sur la carte" required>
                                    <Input placeholder="NOM PRÉNOM" />
                                </Form.Item>
                            </Form>
                        </div>

                        <Divider />

                        <div className={styles.orderSummary}>
                            <div className={styles.summaryRow}>
                                <Text>{quantity} x {props.ticket?.name}</Text>
                                <Text>{(props.ticket?.price * quantity).toFixed(2)} €</Text>
                            </div>
                            <div className={styles.summaryRow}>
                                <Text>Frais de réservation</Text>
                                <Text>2.00 €</Text>
                            </div>
                            <Divider />
                            <div className={styles.summaryRow}>
                                <Text strong>Total</Text>
                                <Text strong className={styles.totalPrice}>{(props.ticket?.price * quantity + 2).toFixed(2)} €</Text>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <Result
                        status="success"
                        icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                        title="Réservation confirmée !"
                        subTitle={`Un email de confirmation a été envoyé à ${form.getFieldValue('email')}`}
                        extra={[
                            <div className={styles.confirmationDetails} key="details">
                                <div className={styles.confirmationTicket}>
                                    <div className={styles.ticketHeader}>
                                        <ContainerOutlined className={styles.ticketIcon} />
                                        <div>
                                            <Text strong className={styles.eventName}>{props.event.name}</Text>
                                            <div className={styles.ticketType}>{props.ticket?.name} x {quantity}</div>
                                        </div>
                                    </div>

                                    <div className={styles.ticketDetails}>
                                        <div className={styles.ticketInfo}>
                                            <CalendarOutlined /> {new Date(props.event.date).toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                        </div>
                                        <div className={styles.ticketInfo}>
                                            <PushpinOutlined /> {props.event.location}
                                        </div>
                                    </div>
                                </div>

                                <Button type="primary" onClick={props.onCancel}>Terminer</Button>
                            </div>
                        ]}
                    />
                );
            default:
                return null;
        }
    };

    const modalFooter = () => {
        if (currentStep === 3 || !props.isUserLoggedIn) {
            return null; // Pas de footer sur l'écran de confirmation ou l'écran de connexion
        }

        return [
            <Button key="back" onClick={currentStep === 0 ? props.onCancel : prevStep}>
                {currentStep === 0 ? 'Annuler' : 'Précédent'}
            </Button>,
            <Button
                key="next"
                type="primary"
                onClick={currentStep === 2 ? handleBooking : nextStep}
            >
                {currentStep === 2 ? 'Confirmer et payer' : 'Suivant'}
            </Button>,
        ];
    };

    const modalTitle = () => {
        if (currentStep === 3 || !props.isUserLoggedIn) {
            return null;
        }

        return (
            <div className={styles.modalHeader}>
                <div className={styles.modalTitle}>
                    Réservation - {props.event.name}
                </div>
                <Steps current={currentStep} size="small" className={styles.modalSteps}>
                    <Step title="Billets" />
                    <Step title="Informations" />
                    <Step title="Paiement" />
                </Steps>
            </div>
        );
    };

    return (
        <>
            {contextHolder}
            <Modal
                title={modalTitle()}
                open={props.visible}
                onCancel={props.onCancel}
                footer={modalFooter()}
                width={700}
                className={styles.ticketModal}
                centered
            >
                {renderStepContent()}
            </Modal>
        </>
    );
};

export default TicketBookingModal;