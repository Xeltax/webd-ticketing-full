import {MehOutlined} from "@ant-design/icons";
import React from "react";
import image1 from "../../../public/error/error1.gif";
import image2 from "../../../public/error/error2.jpg";
import image3 from "../../../public/error/error3.gif";
import image4 from "../../../public/error/error4.gif";
import image5 from "../../../public/error/error5.gif";
import Image from "next/image";

const HandleError = () => {

    const errorImage = [
        image1,
        image2,
        image3,
        image4,
        image5
    ]

    const randomIndex = Math.floor(Math.random() * errorImage.length);

    return (
        <div className={"loadError"}>
            <Image src={errorImage[randomIndex]} alt={"error"} />
            <p>Hmmm...</p>
            <p>On dirais bien qu&apos;il y a eu une erreur réesayer plus tard</p>
            <p style={{fontSize : "0.7rem"}}>(1 point en plus pour les meme ?)</p>
        </div>
    )
}

export default HandleError