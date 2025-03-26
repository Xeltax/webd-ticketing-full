import {Button, Checkbox, Form, FormProps, Input, message, Typography} from "antd";
import styles from "@/styles/Login.module.css";
import Title from "antd/es/typography/Title";
import {useRouter} from "next/router";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import Client from "@/utils/client";
import {ROUTES} from "@/utils/routes";
import {setCookie} from "cookies-next";

const Login = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter();
    type FieldType = {
        email?: string;
        password?: string;
    };

    const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
        Client.post(ROUTES.AUTH.LOGIN, values).then((response) => {
            console.log(response.data.token);
            setCookie("JWT", response.data.token, {expires : new Date(Date.now() + ( 3600 * 1000 * 24))});
            router.push("/")
        }).catch((err) => {
            if (err.response?.data.message === "Invalid password") {
                messageApi.open({
                    type: 'error',
                    content: 'Vos identifiants sont incorrects',
                });
            } else {
                messageApi.open({
                    type: 'error',
                    content: 'Une erreur est survenue',
                });
            }
        })
    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };


    return (
        <div className={styles.formWrapper}>
            {contextHolder}
            <div className={styles.formContainer}>
                <Title style={{fontWeight : "700", textAlign : "center", margin : "2rem 0"}} level={2}>Connexion</Title>
                <Form
                    name="basic"
                    layout={"vertical"}
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Merci de saisir votre adresse mail!' }]}
                    >
                        <Input prefix={<UserOutlined />} type={"email"} placeholder="Addresse email"/>
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Mot de passe"
                        name="password"
                        rules={[{ required: true, message: 'Merci de saisir votre mot de passe!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />}  placeholder="Mot de passe"/>
                    </Form.Item>

                    <div style={{display : "flex", justifyContent: "center", width : "100%"}}>
                        <Button type="primary" htmlType="submit">
                            Se connecter
                        </Button>
                    </div>
                </Form>
                <div className={styles.noAccount}>
                    <p>Pas encore de compte ?</p>
                    <a onClick={() => router.push("/register")}>Créer un compte</a>
                </div>
            </div>
        </div>
    )
}

export default Login;