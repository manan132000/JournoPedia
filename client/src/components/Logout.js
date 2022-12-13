import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

function Logout(props) {
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const navigate = useNavigate();
  useEffect(() => {
    removeCookie("token");
    navigate("/");
    props.setDisplayItems(["inline", "inline", "none"]);
  }, []);
}

export default Logout;
