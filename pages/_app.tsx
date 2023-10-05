import "styles/globals.css";
import Layout from "components/layout/Layout";

const WeatherApp = ({ Component, pageProps }) => {
  return (
    <Layout title="Weather App" description="Check the weather for any city">
      <Component {...pageProps} />
    </Layout>
  );
};

export default WeatherApp;
