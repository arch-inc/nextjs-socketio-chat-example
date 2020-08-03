import { GetServerSideProps } from "next";
import Router from "next/router";
import { v4 as uuidv4 } from "uuid";

import page from "./404";

page.getInitialProps = async ({ res }) => {
  const uuid = uuidv4();
  if (res) {
    res.writeHead(302, {
      Location: `/rooms/${uuid}`,
    });
    res.end();
    return {};
  }
  Router.push(`/rooms/${uuid}`);
  return {};
};

export default page;
