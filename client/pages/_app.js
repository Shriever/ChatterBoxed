import { ChakraProvider } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("http://localhost:5000/refresh_token", {
      method: "POST",
      // headers: "application/json",
      // body: {value: 10},
      credentials: "include",
    })
      .then(async x => {
        const data = await x.json();
        console.log("data: ", data);
        setLoading(false);
      })
      .catch(err => console.log("Error: ", err));
  });
  return (
    <ChakraProvider resetCSS={true}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
