import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {ConfigProvider} from "antd";

export default function App({ Component, pageProps }: AppProps) {
  // @ts-ignore
  const getLayout = Component.getLayout ?? ((page : any) => page)

  return (getLayout(
      <ConfigProvider
          theme={{
            token: {
              fontFamily: "Poppins, sans-serif",
            }
          }}
      >
        <Component {...pageProps} />
      </ConfigProvider>
  ))
}
