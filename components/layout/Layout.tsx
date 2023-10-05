import React from "react";
import Head from "next/head";

const Layout = ({ title, description, children }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
